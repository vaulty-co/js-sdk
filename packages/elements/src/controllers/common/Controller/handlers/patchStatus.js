import { Message } from '@js-sdk/common/src/channels/Message';

import { PATCH_CONTROLLER_STATUS_RESPONSE } from '../messages';

function patchStatusHandler(message) {
  const {
    payload: {
      controllerStatusPatch: status,
    },
  } = message;

  // Prepare model
  this.controllerModel.setStatus(status);

  // Send request back about successfully of operation
  this.controllerSlaveChannel.postMessage(
    new Message(PATCH_CONTROLLER_STATUS_RESPONSE, {
      success: true,
    }),
  );
}

export default patchStatusHandler;
export {
  patchStatusHandler,
};
