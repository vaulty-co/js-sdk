import { Field } from './common/Field';
import { DestroyedField } from './common/DestroyedField';
import { TextInputField } from './instances/TextInputField';
import { CardNumberField } from './instances/CardNumberField';
import { CardVerificationCodeField } from './instances/CardVerificationCodeField';
import { CardExpirationDateField } from './instances/CardExpirationDateField';
import { makeFieldSelector } from './common/store/selectors';

const FIELD_TYPES = {
  textInput: TextInputField,
  cardNumber: CardNumberField,
  cardVerificationCode: CardVerificationCodeField,
  cardExpirationDate: CardExpirationDateField,
};

/**
 * @class
 */
class FieldProxy {
  /**
   * @param {fieldType} type
   * @param {FieldOptions} options
   */
  constructor(type, options = {}) {
    const FieldInstance = FIELD_TYPES[type];
    if (FieldInstance) {
      this.field = new FieldInstance(options);
    } else {
      // FIXME - here should be some error handler for SDK user
      this.field = new Field(options);
    }
    /**
     * @type {string}
     */
    this.id = this.field.id;
    /**
     * Field selector
     * @type {function(SDKState): ?FieldModel}
     * @protected
     */
    this.fieldSelector = makeFieldSelector(this.field.id);

    const unsubscribe = options.store.subscribe(() => {
      const field = this.fieldSelector(options.store.getState());
      if (!field) {
        this.field = new DestroyedField();
        unsubscribe();
      }
    });
  }

  /**
   * Append field in some DOM node
   * @param {string|HTMLElement} parentNode - valid css selector or DOM node, where element should be appended
   */
  appendTo(parentNode) {
    return this.field.appendTo(parentNode);
  }

  /**
   * Update field settings
   * @param {FieldSettings} settings
   */
  update(settings) {
    return this.field.update(settings);
  }

  /**
   * Get field status
   * @returns {FieldStatus}
   */
  getStatus() {
    return this.field.getStatus();
  }

  /**
   * Add handler to event
   * @param {string} eventName
   * @param {Function} eventHandler
   * @return {*}
   */
  on(eventName, eventHandler) {
    return this.field.on(eventName, eventHandler);
  }

  /**
   * Remove handler from event
   * @param {string} eventName
   * @param {Function} eventHandler
   * @return {*}
   */
  off(eventName, eventHandler) {
    return this.field.off(eventName, eventHandler);
  }

  /**
   * Focus field
   */
  focus() {
    return this.field.focus();
  }

  /**
   * Blur field
   */
  blur() {
    return this.field.blur();
  }

  /**
   * Clear field value
   */
  clear() {
    return this.field.clear();
  }

  /**
   * Destroy field and its DOM tree. It does not destroy parent, where field have been placed.
   * Field is not usable after destroy
   */
  destroy() {
    return this.field.destroy();
  }
}

export default FieldProxy;
export {
  FIELD_TYPES,
  FieldProxy,
};
