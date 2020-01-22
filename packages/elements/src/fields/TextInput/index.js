import Message from '@js-sdk/utils/src/channels/Message';

import { Field } from '../Field';
import { GET_FIELD_DATA_REQUEST, GET_FIELD_DATA_RESPONSE } from '../Field/messages';
import styles from './styles.scss';

/**
 * It renders simple text input node
 * @class
 */
class TextInput extends Field {
  constructor(options) {
    const node = document.createElement('input');
    node.setAttribute('type', 'text');
    node.className = styles.input;

    super({
      ...options,
      node,
    });

    this.handleGettingData = this.handleGettingData.bind(this);
    this.broadcastChannel.addEventListener('message', this.handleGettingData);

    this.handleInputChanges = this.handleInputChanges.bind(this);
    this.node.addEventListener('input', this.handleInputChanges);
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
          {
            id: this.id,
            name: this.name,
            data: this.node.value,
          },
        ).toString(),
      );
    }
  }

  /**
   * Handle input changes
   */
  handleInputChanges() {
    const { value } = this.node;
    this.sendDataChanges({
      isDirty: Boolean(value),
      isValid: true,
    });
  }

  destroy() {
    this.broadcastChannel.removeEventListener('message', this.handleGettingData);
    this.handleGettingData = null;

    this.node.removeEventListener('input', this.handleInputChanges);
    this.handleInputChanges = null;

    super.destroy();
  }
}

export default TextInput;
export {
  TextInput,
};
