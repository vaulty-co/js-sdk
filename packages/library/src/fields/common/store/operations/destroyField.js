import { createInvariant } from '@vaulty/common/src/helpers/invariant';

import {
  operationRemoveFieldsFromControllers,
} from '../../../../controllers/common/store/operations/removeFieldsFromControllers';
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
  (dispatch, getState, channels) => {
    const state = getState();
    const field = makeFieldSelector(id)(state);
    innerInvariant(
      field,
      `Field ${id} should be created before destroying`,
    );

    dispatch(
      operationRemoveFieldsFromControllers({
        fieldsIds: [field.id],
      }),
    );

    channels.unregister({ channelId: id });
    dispatch(actions.removeField(field));
  }
);

export default operationDestroyField;
export {
  operationDestroyField,
};
