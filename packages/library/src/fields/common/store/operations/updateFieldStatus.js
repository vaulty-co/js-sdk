import Message from '@js-sdk/common/src/channels/Message';
import {
  PATCH_FIELD_STATUS_REQUEST,
  PATCH_FIELD_STATUS_RESPONSE,
} from '@js-sdk/elements/src/fields/common/Field/messages';

import { actions } from '../storeArtifacts';
import { makeFieldSelector } from '../selectors';

/**
 * Operation for updating field's status
 * @param {string} id
 * @param {FieldStatus} status
 * @return {operationResult}
 */
const operationUpdateFieldStatus = ({ id, status }) => (
  (dispatch, getState, channels) => {
    const fieldChannel = channels.getChannel(id);
    const field = makeFieldSelector(id)(getState());
    const previousStatus = field.status;

    dispatch(
      actions.setFieldStatus({
        fieldId: id,
        status,
      }),
    );
    fieldChannel.postMessage(new Message(
      PATCH_FIELD_STATUS_REQUEST,
      {
        fieldStatusPatch: status,
      },
    ));
    fieldChannel.subscribe(PATCH_FIELD_STATUS_RESPONSE, (message) => {
      if (message.payload.error) {
        dispatch(
          actions.setFieldStatus({
            fieldId: id,
            status: previousStatus,
          }),
        );
      }
    });
  }
);

export default operationUpdateFieldStatus;
export {
  operationUpdateFieldStatus,
};
