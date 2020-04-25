import { Message } from '@js-sdk/common/src/channels/Message';
import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';

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
      id: this.fieldModel.id,
      name: this.fieldModel.getName(),
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
    if (message.type === GET_FIELD_DATA_REQUEST && this.fieldModel.id === message.payload.fieldId) {
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
    this.validate();
    this.sendStatusChanges();
  }

  /**
   * Handle input focus
   * @protected
   */
  handleInputFocus() {
    this.fieldModel.setStatus({
      focus: FieldModel.STATUSES.FOCUS.FOCUSED,
    });
    this.sendStatusChanges();
  }

  /**
   * Handle input blur
   * @protected
   */
  handleInputBlur() {
    this.fieldModel.setStatus({
      focus: FieldModel.STATUSES.FOCUS.UNFOCUSED,
    });
    this.sendStatusChanges();
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
