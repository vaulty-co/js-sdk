import { TextInputField } from './fields/TextInputField';
import { VaultyForm } from './controllers/VaultyForm';

/**
 * @typedef {Object} VaultySDKOptions
 * @property {string} authKey - key for authorization SDK in Vaulty services
 */

const FIELDS = {
  textInput: TextInputField,
};

/**
 * @class
 */
class VaultySDK {
  /**
   * Create field instance
   * @param {string} type - field type
   * @param {Object} options
   * @returns {?VaultyField}
   */
  createField(type, options) {
    const FieldInstance = FIELDS[type];
    if (FieldInstance) {
      return new FieldInstance(options);
    }
    // FIXME - here should be some error handler for SDK user
    return null;
  }

  /**
   * Create form for controlling fields
   * @param {VaultyFormOptions} options
   * @returns {Form}
   */
  createForm(options) {
    return new VaultyForm(options);
  }
}

export default VaultySDK;
