import objectPath from 'object-path';
import { Message } from '@js-sdk/common/src/channels/Message';
import { ControllerModel } from '@js-sdk/common/src/models/controllers/ControllerModel';

import { SUBMIT_RESPONSE } from '../messages';

import {
  GET_FIELD_DATA_REQUEST,
  GET_FIELD_DATA_RESPONSE,
} from '../../../../fields/common/Field/messages';

function submitHandler(message) {
  const {
    payload: options,
  } = message;

  // Set loading status
  this.controllerModel.setStatus({
    readiness: ControllerModel.STATUSES.READINESS.LOADING,
  });

  // Send request back about successfully of operation
  const { fieldsIds } = this.controllerModel;
  const submittingPromises = fieldsIds.map((fieldId) => (
    new Promise((resolve) => {
      const handleFieldData = (textMessage) => {
        const fieldMessage = Message.of(textMessage);
        if (fieldMessage.type === GET_FIELD_DATA_RESPONSE && fieldMessage.payload.id === fieldId) {
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
    })
  ));

  Promise.all(submittingPromises)
    .then((result) => {
      // Stop loading
      this.controllerModel.setStatus({
        readiness: ControllerModel.STATUSES.READINESS.READY,
      });
      return result;
    })
    .then((result) => {
      const data = result.reduce((resultData, field) => {
        objectPath.set(resultData, field.name, field.data);
        return resultData;
      }, {});
      // TODO - add calling proxy for sending data
      console.log('Posting to proxy', {
        ...data,
        ...options.data,
      });
      // FIXME - emulate server response time and should be deleted after applying reverse proxy
      setTimeout(() => {
        this.controllerSlaveChannel.postingMessage(
          new Message(
            SUBMIT_RESPONSE,
            {
              success: true,
              data: {
                controllerStatusPatch: this.controllerModel.status,
              },
            },
          ),
        );
      }, 300);
    });
}

export default submitHandler;
export {
  submitHandler,
};
