import { Message } from '@js-sdk/common/src/channels/Message';
import {
  PUT_CONTROLLER_REQUEST,
  PUT_CONTROLLER_RESPONSE,
} from '@js-sdk/elements/src/controllers/common/Controller/messages';
import { createInvariant } from '@js-sdk/common/src/helpers/invariant';

import { actions } from '../storeArtifacts';
import { makeControllerSelector } from '../selectors';

const innerInvariant = createInvariant('operationPutController');

/**
 * Operation for putting controller
 * @param {string} id
 * @return {operationResult}
 */
const operationPutController = ({ id }) => (dispatch, getState, channels) => {
  const controller = makeControllerSelector(id)(getState());
  innerInvariant(
    controller,
    `Controller ${id} should be created before put.`,
  );

  const controllerChannel = channels.getChannel(id);
  controllerChannel.postMessage(new Message(
    PUT_CONTROLLER_REQUEST,
    {
      controller,
    },
  ));
  controllerChannel.subscribe(PUT_CONTROLLER_RESPONSE, (message) => {
    if (message.payload.success) {
      const { data: { controllerStatusPatch } } = message.payload;
      dispatch(
        actions.setControllerStatus({
          controllerId: id,
          status: controllerStatusPatch,
        }),
      );
    }
  });
};

export default operationPutController;
export {
  operationPutController,
};
