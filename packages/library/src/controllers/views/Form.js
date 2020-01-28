import { queryString } from '@js-sdk/elements/src/controllers/Form/route/queryString';
import { SUBMIT_REQUEST, SUBMIT_RESPONSE } from '@js-sdk/elements/src/controllers/Form/messages';
import { MasterChannel } from '@js-sdk/utils/src/channels/MasterChannel';
import { Message } from '@js-sdk/utils/src/channels/Message';

import { Config } from '../../config';
import { IFrame } from '../../helpers/IFrame';
import { Controller } from './Controller';
import { connectForm } from '../utils/connectForm';
import { NO_FIELDS_ERROR } from '../events/noFieldsError';

const FORM_STATUSES = {
  INITIALIZED: 'initialized',
  PROCESSING: 'processing',
  READY: 'ready',
};

/**
 * @typedef {Object} FormOptions
 * @property {Array<Field>} fields - array of Field instances
 * @property {string} action - URL, where data should be submitted
 * @property {string} encode - type of submitting data (url encode, json etc.)
 * @property {string} method - method of sending data (POST, GET etc.)
 * @property {Object} headers - headers, which should be provided in action call
 */

/**
 * @typedef {Object} FormSubmitOptions
 * @property {*} data - additional data, which is attached to fields data on submit
 * @property {Object} headers - additional headers, which should be provided in action call. They are merged with initial form headers and are replaced,
 * if some of them are different.
 */

class Form extends Controller {
  static get STATUSES() {
    return FORM_STATUSES;
  }

  /**
   * @param {FormOptions} options
   */
  constructor(options) {
    super(options);

    this.controllerIframe = new IFrame({
      width: 0,
      height: 0,
      src: `${Config.elementsOrigin}/?${queryString}&channelId=${this.id}`,
    });
    this.fields = options?.fields ?? [];
    this.appendTo(document.body);
  }

  /**
   * Add fields to form
   * @param {Array<Field>} fields
   */
  addFields(fields) {
    this.fields.push(...fields);
  }

  /**
   * Remove specified fields from form
   * @param {Array<Field>} fields
   */
  removeFields(fields) {
    this.fields = this.fields.filter(
      /**
       * @param {Field} field
       */
      (field) => (
        fields.includes(field)
      ),
    );
  }

  /**
   * Remove all fields from form
   */
  removeAllFields() {
    this.fields = [];
  }

  appendTo(node) {
    super.appendTo(node);

    this.openChannel();
    this.handleSubmit();
  }

  /**
   * Submit form in options specified URL
   * @param {FormSubmitOptions} options
   */
  submit(options) {
    if (this.fields.length) {
      if (this.controllerMasterChannel) {
        this.dispatchers.setControllerStatus({
          controllerId: this.id,
          status: FORM_STATUSES.PROCESSING,
        });
        this.controllerMasterChannel.postMessage(
          new Message(
            SUBMIT_REQUEST,
            {
              fieldsIds: this.controller.fieldsIds,
              options,
            },
          ),
        );
      }
    } else {
      this.events.emit('submit', NO_FIELDS_ERROR);
    }
  }

  /**
   * Destroy form (or form and its fields).
   * Form is not usable after destroy
   * @param {boolean} [withFields = false] - destroy form with its fields
   */
  destroy(withFields = false) {
    if (withFields) {
      this.fields.forEach(
        /**
         * @param {Field} field
         */
        (field) => field.destroy(),
      );
    }

    if (this.controllerMasterChannel) {
      this.controllerMasterChannel.destroy();
    }

    super.destroy();
  }

  /**
   * Connect to slave channel
   * @private
   */
  openChannel() {
    this.controllerMasterChannel = new MasterChannel({
      channelId: this.id,
      target: this.controllerIframe.node,
      targetOrigin: Config.elementsOrigin,
    });
    this.controllerMasterChannel.connect();
  }

  handleSubmit() {
    this.controllerMasterChannel.subscribe(SUBMIT_RESPONSE, (message) => {
      const { payload: { success = false } } = message;
      if (success) {
        this.dispatchers.setControllerStatus({
          controllerId: this.id,
          status: FORM_STATUSES.READY,
        });
        this.events.emit('submit', { success: true });
      }
    });
  }
}

const ConnectedForm = connectForm(Form);

export default Form;
export {
  Form,
  ConnectedForm,
};
