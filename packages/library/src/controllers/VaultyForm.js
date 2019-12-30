// FIXME - disabling eslint should be removed after creating behavior for methods
/* eslint-disable class-methods-use-this */
import get from 'lodash/get';
import { queryString } from 'vaulty-js-sdk-elements/src/controllers/Form/route/queryString';

import { IFrame } from '../helpers/IFrame';
import { VaultyController } from './VaultyController';

/**
 * @typedef {Object} VaultyFormOptions
 * @property {Array<VaultyField>} fields - array of VaultyField instances
 * @property {string} action - URL, where data should be submitted
 * @property {string} encode - type of submitting data (url encode, json etc.)
 * @property {string} method - method of sending data (POST, GET etc.)
 * @property {Object} headers - headers, which should be provided in action call
 */

/**
 * @typedef {Object} VaultyFormSubmitOptions
 * @property {*} data - additional data, which is attached to fields data on submit
 * @property {Object} headers - additional headers, which should be provided in action call. They are merged with initial form headers and are replaced,
 * if some of them are different.
 */

class VaultyForm extends VaultyController {
  /**
   * @param {VaultyFormOptions} options
   */
  constructor(options) {
    super(options);

    // FIXME - fixme URL hardcode with using config
    this.controllerIframe = new IFrame({
      width: 0,
      height: 0,
      src: `http://localhost:3001/?${queryString}`,
    });
    this.fields = get(options, 'fields', []);
    this.appendTo(document.body);
  }

  /**
   * Add fields to form
   * @param {Array<VaultyField>} fields
   */
  addFields(fields) {
    this.fields.push(...fields);
  }

  /**
   * Remove specified fields from form
   * @param {Array<VaultyField>} fields
   */
  removeFields(fields) {
    this.fields = this.fields.filter(
      /**
       * @param {VaultyField} field
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
   * @param {VaultyFormSubmitOptions} options
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
         * @param {VaultyField} field
         */
        (field) => field.destroy(),
      );
    }
    VaultyController.destroy.call(VaultyForm, withFields);
  }
}

export default VaultyForm;
export {
  VaultyForm,
};
