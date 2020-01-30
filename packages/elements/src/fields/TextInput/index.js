import { Message } from '@js-sdk/utils/src/channels/Message';
import { TextNode } from '@js-sdk/utils/src/nodes/TextNode';

import { Field } from '../Field';
import { GET_FIELD_DATA_REQUEST, GET_FIELD_DATA_RESPONSE } from '../Field/messages';
import styles from './styles.scss';

/**
 * It renders simple text input node
 * @class
 */
class TextInput extends Field {
  constructor(options) {
    const node = new TextNode();
    node.addClass(styles.input);

    super({
      ...options,
      node,
    });

    this.handleGettingData = this.handleGettingData.bind(this);
    this.broadcastChannel.addEventListener('message', this.handleGettingData);

    this.handleInputChanges = this.handleInputChanges.bind(this);
    this.fieldNode.on('input', this.handleInputChanges);
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
            data: this.fieldNode.getValue(),
          },
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
      isValid: true,
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

export default TextInput;
export {
  TextInput,
};
