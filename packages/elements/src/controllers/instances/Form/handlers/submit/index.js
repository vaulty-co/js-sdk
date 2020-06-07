import objectPath from 'object-path';
import { Message } from '@vaulty/common/src/channels/Message';
import { ControllerModel } from '@vaulty/common/src/models/controllers/ControllerModel';

import { Config } from '../../../../../config';
import { SUBMIT_RESPONSE } from '../../messages';
import { getFieldData } from './getFieldData';

/**
 * Send request by specified path
 * @param {string} path
 * @param {Object} data
 * @param {FormSubmitOptions} options
 * @this FormElement
 */
function sendRequest(path, data, options) {
  return fetch(`${Config.apiOrigin}${path}`, {
    method: options.method || 'POST',
    headers: {
      ...options.headers,
      'Content-Type': 'text/json',
    },
    body: JSON.stringify({
      ...data,
      ...options.data,
    }),
  }).then(
    (response) => response.ok,
    () => false,
  );
}

/**
 * Submit handler for Form element
 * @this FormElement
 */
function submitHandler(message) {
  const {
    payload: {
      path,
      options,
    },
  } = message;

  // Set loading status
  this.controllerModel.setStatus({
    readiness: ControllerModel.STATUSES.READINESS.LOADING,
  });

  // Get data from fields
  const { fieldsIds } = this.controllerModel;
  const submittingPromises = fieldsIds.map(
    (fieldId) => getFieldData.call(this, fieldId),
  );

  Promise.all(submittingPromises)
    .then(
      (result) => {
        const data = result.reduce((resultData, field) => {
          objectPath.set(resultData, field.name, field.data);
          return resultData;
        }, {});
        return sendRequest.call(this, path, data, options);
      },
      () => false,
    )
    .then((isSuccess) => {
      // Stop loading
      this.controllerModel.setStatus({
        readiness: ControllerModel.STATUSES.READINESS.READY,
      });
      // Send request back about operation completion
      this.controllerSlaveChannel.postingMessage(new Message(
        SUBMIT_RESPONSE,
        {
          success: isSuccess,
          data: {
            controllerStatusPatch: this.controllerModel.status,
          },
        },
      ));
    });
}

export default submitHandler;
export {
  submitHandler,
};
