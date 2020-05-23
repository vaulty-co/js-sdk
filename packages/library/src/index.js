import { VALIDATORS_TYPES } from '@js-sdk/elements/src/validators/constants';
import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';
import { ControllerModel } from '@js-sdk/common/src/models/controllers/ControllerModel';

import { createStore } from './store/index';
import { FieldProxy } from './fields/FieldProxy';
import { FormProxy } from './controllers/FormProxy';
import { actions } from './store/config/index';

/**
 * @typedef {Object} SDKConfig
 * @property {string} sdkOrigin - origin of sdk, when it is run
 * @property {string} elementsOrigin - origin, when elements is hosted
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

  /**
   * @param {SDKConfig} config
   */
  constructor(config) {
    /**
     * SDK redux store
     * @type {Store} - redux store
     */
    this.store = createStore();
    this.store.dispatch(
      actions.addConfig(config),
    );
  }

  /**
   * Create field instance
   * @param {string} type - field type
   * @param {SDKFieldOptions} options
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
   * @param {SDKFormOptions} options
   * @returns {FormProxy}
   */
  createForm(options) {
    return new FormProxy({
      ...options,
      store: this.store,
    });
  }
}

export default SDK;
