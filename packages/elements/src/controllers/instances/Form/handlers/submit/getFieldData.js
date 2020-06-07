import { Message } from '@vaulty/common/src/channels/Message';

import {
  GET_FIELD_DATA_REQUEST,
  GET_FIELD_DATA_RESPONSE,
} from '../../../../../fields/common/Field/messages';

const FIELD_RESPONSE_TIMEOUT = 10000; // 1s

/**
 * Get field data with using broadcast channel.
 * Getting data has timeout and should be rejected, if data is not received in this time.
 * @param {string} fieldId
 * @this FormElement
 */
function getFieldData(fieldId) {
  return new Promise((resolve, reject) => {
    const waitingTimeout = setTimeout(reject, FIELD_RESPONSE_TIMEOUT);
    const handleFieldData = (textMessage) => {
      const fieldMessage = Message.of(textMessage);
      if (fieldMessage.type === GET_FIELD_DATA_RESPONSE && fieldMessage.payload.id === fieldId) {
        clearTimeout(waitingTimeout);
        this.broadcastChannel.removeEventListener('message', handleFieldData);
        resolve(fieldMessage.payload);
      }
    };
    this.broadcastChannel.addEventListener('message', handleFieldData);
    this.broadcastChannel.postMessage(
      new Message(GET_FIELD_DATA_REQUEST, {
        fieldId,
      }).toString(),
    );
  });
}

export default getFieldData;
export {
  getFieldData,
};
