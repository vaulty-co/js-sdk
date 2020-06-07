import { Message } from '@vaulty/common/src/channels/Message';
import { ControllerModel } from '@vaulty/common/src/models/controllers/ControllerModel';

import { PUT_CONTROLLER_RESPONSE } from '../messages';

function putControllerHandler(message) {
  const {
    payload: {
      controller: controllerModelJson,
    },
  } = message;

  // Prepare model
  this.controllerModel = ControllerModel.of(controllerModelJson);
  this.controllerModel.setStatus({
    readiness: ControllerModel.STATUSES.READINESS.READY,
  });

  // Send request back about successfully of operation
  this.controllerSlaveChannel.postMessage(
    new Message(PUT_CONTROLLER_RESPONSE, {
      success: true,
      data: {
        controllerStatusPatch: this.controllerModel.status,
      },
    }),
  );
}

export default putControllerHandler;
export {
  putControllerHandler,
};
