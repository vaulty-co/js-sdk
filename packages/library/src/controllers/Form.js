// FIXME - disabling eslint should be removed after creating behavior for methods
/* eslint-disable class-methods-use-this */
import { queryString } from '@js-sdk/elements/src/controllers/Form/route/queryString';

import { Config } from '../config';
import { IFrame } from '../helpers/IFrame';
import { Controller } from './Controller';
import { connectForm } from './utils/connectForm';

const FORM_STATUSES = {
  INITIALIZED: 'initialized',
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
      src: `${Config.elementsOrigin}/?${queryString}`,
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

  /**
   * Submit form in options specified URL
   * @param {FormSubmitOptions} options
   */
  // FIXME - disabling eslint should be removed after implementation
  // eslint-disable-next-line no-unused-vars
  submit(options) {

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
    Controller.destroy.call(Form, withFields);
  }
}

const ConnectedForm = connectForm(Form);

export default Form;
export {
  Form,
  ConnectedForm,
};
