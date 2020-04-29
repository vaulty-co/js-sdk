import { VALIDATORS_TYPES } from '@js-sdk/elements/src/validators/constants';
import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';
import { ControllerModel } from '@js-sdk/common/src/models/controllers/ControllerModel';

import { createStore } from './store/index';
import { TextInputField } from './fields/instances/TextInputField';
import { CardNumberField } from './fields/instances/CardNumberField';
import { CardVerificationCodeField } from './fields/instances/CardVerificationCodeField';
import { CardExpirationDateField } from './fields/instances/CardExpirationDateField';
import { Form } from './controllers/instances/Form/index';

/**
 * @typedef {Object} SDKOptions
 * @property {string} authKey - key for authorization SDK services
 */

const FIELDS = {
  textInput: TextInputField,
  cardNumber: CardNumberField,
  cardVerificationCode: CardVerificationCodeField,
  cardExpirationDate: CardExpirationDateField,
};

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
   * @param {Object} options
   * @returns {?Field}
   */
  createField(type, options) {
    const FieldInstance = FIELDS[type];
    if (FieldInstance) {
      return new FieldInstance({
        ...options,
        store: this.store,
      });
    }
    // FIXME - here should be some error handler for SDK user
    return null;
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
