import { Message } from '@js-sdk/common/src/channels/Message';
import {
  PUT_FIELD_REQUEST,
  PUT_FIELD_RESPONSE,
} from '@js-sdk/elements/src/fields/common/Field/messages';
import { createInvariant } from '@js-sdk/common/src/helpers/invariant';

import { actions } from '../storeArtifacts';
import { makeFieldSelector } from '../selectors';

const innerInvariant = createInvariant('operationPutField');

/**
 * Operation for putting field
 * @param {string} id
 * @return {operationResult}
 */
const operationPutField = ({ id }) => (dispatch, getState, channels) => {
  const field = makeFieldSelector(id)(getState());
  innerInvariant(
    field,
    `Field ${id} should be created before put.`,
  );

  const fieldChannel = channels.getChannel(id);
  fieldChannel.postMessage(new Message(
    PUT_FIELD_REQUEST,
    {
      field,
    },
  ));
  fieldChannel.subscribe(PUT_FIELD_RESPONSE, (message) => {
    if (message.payload.success) {
      const { data: { fieldStatusPatch } } = message.payload;
      dispatch(
        actions.setFieldStatus({
          fieldId: id,
          status: fieldStatusPatch,
        }),
      );
    }
  });
};

export default operationPutField;
export {
  operationPutField,
};
