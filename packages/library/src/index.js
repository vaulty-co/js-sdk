import { VALIDATORS_TYPES } from '@js-sdk/elements/src/validators/constants';
import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';
import { ControllerModel } from '@js-sdk/common/src/models/controllers/ControllerModel';

import { createStore } from './store/index';
import { FieldProxy } from './fields/FieldProxy';
import { Form } from './controllers/instances/Form/index';

/**
 * @typedef {Object} SDKOptions
 * @property {string} authKey - key for authorization SDK services
 */

/**
 * @class
 */
class SDK {
  static get FORM_STATUSES() {
    return ControllerModel.STATUSES;
  }

  static get FIELD_STATUSES() {
    return FieldModel.STATUSES;
  }

  static get VALIDATORS() {
    return VALIDATORS_TYPES;
  }

  constructor() {
    /**
     * SDK redux store
     * @type {Store} - redux store
     */
    this.store = createStore();
  }

  /**
   * Create field instance
   * @param {string} type - field type
   * @param {FieldOptions} options
   * @returns {?FieldProxy}
   */
  createField(type, options) {
    const resultOptions = {
      ...options,
      store: this.store,
    };
    return new FieldProxy(type, resultOptions);
  }

  /**
   * Create form for controlling fields
   * @param {FormOptions} options
   * @returns {Form}
   */
  createForm(options) {
    return new Form({
      ...options,
      store: this.store,
    });
  }
}

export default SDK;
