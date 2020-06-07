import { Message } from '@vaulty/common/src/channels/Message';

import {
  REMOVE_FIELDS_IDS_FROM_CONTROLLER_RESPONSE,
} from '../messages';

function removeFieldsIdsHandler(message) {
  const {
    payload: {
      fieldsIdsPatch: fieldsIds,
    },
  } = message;

  // Prepare model
  this.controllerModel.removeFields(fieldsIds);

  // Send request back about successfully of operation
  this.controllerSlaveChannel.postMessage(
    new Message(REMOVE_FIELDS_IDS_FROM_CONTROLLER_RESPONSE, {
      success: true,
    }),
  );
}

export default removeFieldsIdsHandler;
export {
  removeFieldsIdsHandler,
};
