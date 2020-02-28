import objectPath from 'object-path';
import { Message } from '@js-sdk/utils/src/channels/Message';

import {
  GET_FIELD_DATA_REQUEST,
  GET_FIELD_DATA_RESPONSE,
} from '../../fields/common/Field/messages';
import { Controller } from '../Controller';
import {
  SUBMIT_REQUEST,
  SUBMIT_RESPONSE,
} from './messages';

/**
 * Form controller for submitting data from fields
 */
class Form extends Controller {
  /**
   * Submit data from fields
   */
  submit(fieldsIds) {
    const submittingPromises = fieldsIds.map((fieldId) => (
      new Promise((resolve) => {
        const handleFieldData = (textMessage) => {
          const message = Message.of(textMessage);
          if (message.type === GET_FIELD_DATA_RESPONSE && message.payload.id === fieldId) {
            this.broadcastChannel.removeEventListener('message', handleFieldData);
            resolve(message.payload);
          }
        };
        this.broadcastChannel.addEventListener('message', handleFieldData);
        this.broadcastChannel.postMessage(
          new Message(GET_FIELD_DATA_REQUEST, {
            fieldId,
          }).toString(),
        );
      })
    ));

    Promise.all(submittingPromises)
      .then((result) => {
        const data = result.reduce((resultData, field) => {
          objectPath.set(resultData, field.name, field.data);
          return resultData;
        }, {});
        // TODO - add calling proxy for sending data
        console.log('Posting to proxy', data);
        // FIXME - emulate server response time and should be deleted after applying reverse proxy
        setTimeout(() => {
          this.controllerSlaveChannel.postingMessage(
            new Message(SUBMIT_RESPONSE, { success: true }),
          );
        }, 300);
      });
  }

  /**
   * Register allowed messages by master frame and give response by this messages
   * @private
   */
  registerHandlers() {
    this.controllerSlaveChannel.subscribe(SUBMIT_REQUEST, (message) => {
      const { payload: { fieldsIds } } = message;
      this.submit(fieldsIds);
    });
  }
}

export default Form;
export {
  Form,
};
