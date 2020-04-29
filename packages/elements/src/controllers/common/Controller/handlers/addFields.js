import { Message } from '@js-sdk/common/src/channels/Message';

import { ADD_FIELDS_IDS_TO_CONTROLLER_RESPONSE } from '../messages';

function addFieldsIdsHandler(message) {
  const {
    payload: {
      fieldsIdsPatch: fieldsIds,
    },
  } = message;

  // Prepare model
  this.controllerModel.addFields(fieldsIds);

  // Send request back about successfully of operation
  this.controllerSlaveChannel.postMessage(
    new Message(ADD_FIELDS_IDS_TO_CONTROLLER_RESPONSE, {
      success: true,
    }),
  );
}

export default addFieldsIdsHandler;
export {
  addFieldsIdsHandler,
};
