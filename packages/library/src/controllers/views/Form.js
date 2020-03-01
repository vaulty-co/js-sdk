import {
  FORM_LOADED,
  SUBMIT_REQUEST,
  SUBMIT_RESPONSE,
  INITIALIZE_FORM_REQUEST,
  INITIALIZE_FORM_RESPONSE,
} from '@js-sdk/elements/src/controllers/Form/messages';
import { MasterChannel } from '@js-sdk/utils/src/channels/MasterChannel';
import { Message } from '@js-sdk/utils/src/channels/Message';


import { Config } from '../../config';
import { Controller } from './Controller';
import {
  CONTROLLER_STATUSES,
  CONTROLLER_READINESS_STATUSES,
  CONTROLLER_VALIDATION_STATUSES,
  CONTROLLER_NODE_STATUSES,
  INITIAL_CONTROLLER_STATUS,
} from '../constants';
import { connectForm } from '../utils/connectForm';
import { NO_FIELDS_ERROR } from '../events/noFieldsError';

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

/**
 * @class
 */
class Form extends Controller {
  static get STATUSES() {
    return CONTROLLER_STATUSES;
  }

  /**
   * @param {FormOptions} options
   */
  constructor(options) {
    super(options);

    this.fields = options?.fields ?? [];
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
          status: {
            readiness: CONTROLLER_READINESS_STATUSES.LOADING,
          },
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
    this.controllerMasterChannel.subscribe(FORM_LOADED, (message) => {
      if (message.payload.success) {
        this.dispatchers.setControllerStatus({
          ...INITIAL_CONTROLLER_STATUS,
          node: CONTROLLER_NODE_STATUSES.MOUNTED,
        });
        this.requestInitialization();
      }
    });
    this.controllerMasterChannel.connect();
  }

  /**
   * Request initialization data for getting readiness status
   * @private
   */
  requestInitialization() {
    this.controllerMasterChannel.postMessage(
      new Message(INITIALIZE_FORM_REQUEST),
    );
    this.controllerMasterChannel.subscribe(INITIALIZE_FORM_RESPONSE, (message) => {
      if (message.payload.success) {
        this.dispatchers.setControllerStatus({
          controllerId: this.id,
          status: {
            validation: CONTROLLER_VALIDATION_STATUSES.VALID,
            readiness: CONTROLLER_READINESS_STATUSES.READY,
          },
        });
      }
    });
  }

  /**
   * Handle submit response
   * @private
   */
  handleSubmit() {
    this.controllerMasterChannel.subscribe(SUBMIT_RESPONSE, (message) => {
      const { payload: { success = false } } = message;
      if (success) {
        this.dispatchers.setControllerStatus({
          controllerId: this.id,
          status: {
            readiness: CONTROLLER_READINESS_STATUSES.READY,
          },
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
