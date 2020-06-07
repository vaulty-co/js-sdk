import { Message } from '@vaulty/common/src/channels/Message';
import {
  REMOVE_FIELDS_IDS_FROM_CONTROLLER_REQUEST,
  REMOVE_FIELDS_IDS_FROM_CONTROLLER_RESPONSE,
} from '@vaulty/elements/src/controllers/common/Controller/messages';

import { actions } from '../storeArtifacts';

/**
 * Operation for removing fields from controller
 * @param {string} id
 * @return {operationResult}
 */
const operationRemoveFieldsFromController = ({ id, fieldsIds }) => (
  (dispatch, getState, channels) => {
    const controllerChannel = channels.getChannel(id);

    dispatch(
      actions.removeFieldsFromController({
        controllerId: id,
        fieldsIds,
      }),
    );
    controllerChannel.postMessage(new Message(
      REMOVE_FIELDS_IDS_FROM_CONTROLLER_REQUEST,
      {
        fieldsIdsPatch: fieldsIds,
      },
    ));
    controllerChannel.subscribe(REMOVE_FIELDS_IDS_FROM_CONTROLLER_RESPONSE, (message) => {
      if (message.payload.error) {
        dispatch(
          actions.addFieldsToController({
            controllerId: id,
            fieldsIds,
          }),
        );
      }
    });
  }
);

export default operationRemoveFieldsFromController;
export {
  operationRemoveFieldsFromController,
};
