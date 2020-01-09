import { createStore } from './store/index';
import { ConnectedTextInputField } from './fields/views/TextInputField';
import { Form } from './controllers/Form';

/**
 * @typedef {Object} SDKOptions
 * @property {string} authKey - key for authorization SDK services
 */

const FIELDS = {
  textInput: ConnectedTextInputField,
};

/**
 * @class
 */
class SDK {
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
    return new Form(options);
  }
}

export default SDK;
