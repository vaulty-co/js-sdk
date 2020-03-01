import { Message } from '@js-sdk/utils/src/channels/Message';

import { Field } from '../Field';
import { GET_FIELD_DATA_REQUEST, GET_FIELD_DATA_RESPONSE } from '../Field/messages';

/**
 * It renders simple input like node
 * @class
 */
class InputField extends Field {
  /**
   * @param {FieldOptions} options
   */
  constructor(options) {
    super(options);

    this.handleGettingData = this.handleGettingData.bind(this);
    this.broadcastChannel.addEventListener('message', this.handleGettingData);

    this.handleInputChanges = this.handleInputChanges.bind(this);
    this.fieldNode.on('input', this.handleInputChanges);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.fieldNode.on('focus', this.handleInputFocus);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.fieldNode.on('blur', this.handleInputBlur);
  }

  /**
   * Get data for sending its to controller
   * @returns {{id: string, name: FieldName, data: *}}
   */
  getData() {
    return {
      id: this.id,
      name: this.name,
      data: this.fieldNode.getValue(),
    };
  }

  /**
   * Handle GET_FIELD_DATA_REQUEST
   * @param {string} textMessage
   * @protected
   */
  handleGettingData(textMessage) {
    /**
     * @type {?Message}
     */
    const message = Message.of(textMessage);
    if (message.type === GET_FIELD_DATA_REQUEST && this.id === message.payload.fieldId) {
      this.broadcastChannel.postMessage(
        new Message(
          GET_FIELD_DATA_RESPONSE,
          this.getData(),
        ).toString(),
      );
    }
  }

  /**
   * Handle input changes
   * @protected
   */
  handleInputChanges() {
    const value = this.fieldNode.getValue();
    this.sendDataChanges({
      isDirty: Boolean(value),
      validation: this.composedValidator.validate(value),
    });
  }

  /**
   * Handle input focus
   * @protected
   */
  handleInputFocus() {
    this.sendFocusChanges({
      isFocused: true,
    });
  }

  /**
   * Handle input blur
   * @protected
   */
  handleInputBlur() {
    this.sendFocusChanges({
      isFocused: false,
    });
  }

  destroy() {
    this.broadcastChannel.removeEventListener('message', this.handleGettingData);
    this.handleGettingData = null;

    this.fieldNode.off('input', this.handleInputChanges);
    this.handleInputChanges = null;
    this.fieldNode.off('focus', this.handleInputFocus);
    this.handleInputFocus = null;
    this.fieldNode.off('blur', this.handleInputBlur);
    this.handleInputBlur = null;

    super.destroy();
  }
}

export default InputField;
export {
  InputField,
};
