import {
  FIELD_LOADED_WATCHER,
  FIELD_STATUS_WATCHER,
} from '@js-sdk/elements/src/fields/common/Field/messages';
import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';
import { createInvariant } from '@js-sdk/common/src/helpers/invariant';

import { makeFieldSelector } from '../selectors';
import { actions } from '../storeArtifacts';
import { operationPutField } from './putField';

const innerInvariant = createInvariant('operationMountField');

/**
 * Operation for mounting field
 * @param {string} id
 * @param {HTMLIFrameElement} iframeDomNode
 * @return {operationResult}
 */
const operationMountField = ({ id, iframeDomNode }) => (
  (dispatch, getState, channels) => {
    const field = makeFieldSelector(id)(getState());
    innerInvariant(
      field,
      `Field ${id} should be created before mount.`,
    );
    innerInvariant(
      field.status.node !== FieldModel.STATUSES.NODE.MOUNTED,
      `Field ${id} can not be mounted twice and more times.`,
    );

    const fieldChannel = channels.register({ channelId: id, iframeDomNode });
    fieldChannel.connect();

    /*
     * NOTICE: Describe all field watchers here
     */
    fieldChannel.subscribe(FIELD_LOADED_WATCHER, () => {
      // Reset field status, if it is reloaded
      dispatch(
        actions.setFieldStatus({
          fieldId: id,
          status: {
            ...FieldModel.STATUSES.INITIAL,
            node: FieldModel.STATUSES.NODE.MOUNTED,
          },
        }),
      );
      dispatch(operationPutField({ id }));
    });
    fieldChannel.subscribe(FIELD_STATUS_WATCHER, (message) => {
      const newStatus = message.payload.data.fieldStatusPatch;
      dispatch(
        actions.setFieldStatus({
          fieldId: id,
          status: newStatus,
        }),
      );
    });
  }
);

export default operationMountField;
export {
  operationMountField,
};
