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
   */
  handleInputChanges() {
    const value = this.fieldNode.getValue();
    this.sendDataChanges({
      isDirty: Boolean(value),
      validation: this.composedValidator.validate(value),
    });
  }

  destroy() {
    this.broadcastChannel.removeEventListener('message', this.handleGettingData);
    this.handleGettingData = null;

    this.fieldNode.off('input', this.handleInputChanges);
    this.handleInputChanges = null;

    super.destroy();
  }
}

export default InputField;
export {
  InputField,
};
