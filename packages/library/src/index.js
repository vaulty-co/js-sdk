import { VALIDATORS_TYPES } from '@vaulty/elements/src/validators/constants';
import { FieldModel } from '@vaulty/common/src/models/fields/FieldModel';
import { ControllerModel } from '@vaulty/common/src/models/controllers/ControllerModel';
import { staticInvariant } from '@vaulty/common/src/helpers/invariant';

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

  static get invariant() {
    return staticInvariant;
  }

  /**
   * @param {SDKConfig} config
   */
  constructor(config) {
    this.constructor.invariant(
      Boolean(config.sdkOrigin),
      'Options "sdkOrigin" is required',
    );
    this.constructor.invariant(
      Boolean(config.elementsOrigin),
      'Options "elementsOrigin" is required',
    );
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
    this.constructor.invariant(
      Boolean(type),
      'Field "type" is required',
    );
    this.constructor.invariant(
      Boolean(options?.name),
      'Field "options.name" is required',
    );
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
