import { createInvariant } from '@js-sdk/common/src/helpers/invariant';

import {
  makeControllerSelector,
} from '../selectors';
import { actions } from '../storeArtifacts';

const innerInvariant = createInvariant('operationDestroyController');

/**
 * Operation for destroying controller
 * @param {string} id - controller id
 * @return {operationResult}
 */
const operationDestroyController = ({ id }) => (
  (dispatch, getState, channels) => {
    const controller = makeControllerSelector(id)(getState());
    innerInvariant(
      controller,
      `Controller ${id} should be created before destroying`,
    );

    channels.unregister({ channelId: id });
    dispatch(actions.removeController(controller));
  }
);

export default operationDestroyController;
export {
  operationDestroyController,
};
