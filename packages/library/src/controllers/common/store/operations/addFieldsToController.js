import { Message } from '@vaulty/common/src/channels/Message';
import {
  ADD_FIELDS_IDS_TO_CONTROLLER_REQUEST,
  ADD_FIELDS_IDS_TO_CONTROLLER_RESPONSE,
} from '@vaulty/elements/src/controllers/common/Controller/messages';

import { actions } from '../storeArtifacts';

/**
 * Operation for adding fields to controller
 * @param {string} id
 * @return {operationResult}
 */
const operationAddFieldsToController = ({ id, fieldsIds }) => (
  (dispatch, getState, channels) => {
    const controllerChannel = channels.getChannel(id);

    dispatch(
      actions.addFieldsToController({
        controllerId: id,
        fieldsIds,
      }),
    );
    controllerChannel.postMessage(new Message(
      ADD_FIELDS_IDS_TO_CONTROLLER_REQUEST,
      {
        fieldsIdsPatch: fieldsIds,
      },
    ));
    controllerChannel.subscribe(ADD_FIELDS_IDS_TO_CONTROLLER_RESPONSE, (message) => {
      if (message.payload.error) {
        dispatch(
          actions.removeFieldsFromController({
            controllerId: id,
            fieldsIds,
          }),
        );
      }
    });
  }
);

export default operationAddFieldsToController;
export {
  operationAddFieldsToController,
};
