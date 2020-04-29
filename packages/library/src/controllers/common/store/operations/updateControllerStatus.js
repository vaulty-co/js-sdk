import { Message } from '@js-sdk/common/src/channels/Message';
import {
  PATCH_CONTROLLER_STATUS_REQUEST,
  PATCH_CONTROLLER_STATUS_RESPONSE,
} from '@js-sdk/elements/src/controllers/common/Controller/messages';

import { actions } from '../storeArtifacts';
import { makeControllerSelector } from '../selectors';

/**
 * Operation for updating controller's status
 * @param {string} id
 * @param {ControllerStatus} status
 * @return {operationResult}
 */
const operationUpdateControllerStatus = ({ id, status }) => (
  (dispatch, getState, channels) => {
    const controllerChannel = channels.getChannel(id);
    const controller = makeControllerSelector(id)(getState());
    const previousStatus = controller.status;

    dispatch(
      actions.setControllerStatus({
        controllerId: id,
        status,
      }),
    );
    controllerChannel.postMessage(new Message(
      PATCH_CONTROLLER_STATUS_REQUEST,
      {
        controllerStatusPatch: status,
      },
    ));
    controllerChannel.subscribe(PATCH_CONTROLLER_STATUS_RESPONSE, (message) => {
      if (message.payload.error) {
        dispatch(
          actions.setControllerStatus({
            controllerId: id,
            status: previousStatus,
          }),
        );
      }
    });
  }
);

export default operationUpdateControllerStatus;
export {
  operationUpdateControllerStatus,
};
