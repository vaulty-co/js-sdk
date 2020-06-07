import { ControllerModel } from '@vaulty/common/src/models/controllers/ControllerModel';
import {
  CONTROLLER_LOADED_WATCHER,
} from '@vaulty/elements/src/controllers/common/Controller/messages';
import { createInvariant } from '@vaulty/common/src/helpers/invariant';

import { makeControllerSelector } from '../selectors';
import { actions } from '../storeArtifacts';
import { operationPutController } from './putController';


const innerInvariant = createInvariant('operationMountController');

/**
 * Operation for mounting controller
 * @param {string} id
 * @param {HTMLIFrameElement} iframeDomNode
 * @return {operationResult}
 */
const operationMountController = ({ id, iframeDomNode }) => (
  (dispatch, getState, channels) => {
    const controller = makeControllerSelector(id)(getState());
    innerInvariant(
      controller,
      `Controller ${id} should be created before mount.`,
    );
    innerInvariant(
      controller.status.node !== ControllerModel.STATUSES.NODE.MOUNTED,
      `Controller ${id} can not be mounted twice and more times.`,
    );

    const controllerChannel = channels.register({ channelId: id, iframeDomNode });
    controllerChannel.connect();

    /*
     * NOTICE: Describe all controller watchers here
     */
    controllerChannel.subscribe(CONTROLLER_LOADED_WATCHER, () => {
      // Reset controller status, if it is reloaded
      dispatch(
        actions.setControllerStatus({
          controllerId: id,
          status: {
            ...ControllerModel.STATUSES.INITIAL,
            node: ControllerModel.STATUSES.NODE.MOUNTED,
          },
        }),
      );
      dispatch(operationPutController({ id }));
    });
  }
);

export default operationMountController;
export {
  operationMountController,
};
