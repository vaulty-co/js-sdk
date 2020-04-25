import { createInvariant } from '@js-sdk/common/src/helpers/invariant';

import {
  makeFieldSelector,
} from '../selectors';
import { actions } from '../storeArtifacts';

const innerInvariant = createInvariant('operationDestroyField');

/**
 * Operation for destroying field
 * @param {string} id - field id
 * @return {operationResult}
 */
const operationDestroyField = ({ id }) => (
  (dispatch, getState, fieldsChannels) => {
    const field = makeFieldSelector(id)(getState());
    innerInvariant(
      field,
      `Field ${id} should be created before destroying`,
    );

    fieldsChannels.unregister({ channelId: id });
    dispatch(actions.removeField(field));
  }
);

export default operationDestroyField;
export {
  operationDestroyField,
};
