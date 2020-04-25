import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';
import { Message } from '@js-sdk/common/src/channels/Message';
import { PUT_FIELD_RESPONSE } from '../Field/messages';

function putFieldHandler(message) {
  const {
    payload: {
      field: fieldModelJson,
    },
  } = message;

  // Prepare model
  this.fieldModel = FieldModel.of(fieldModelJson);
  this.fieldModel.setStatus({
    validation: {
      status: FieldModel.STATUSES.VALIDATION.VALID,
      invalidValidators: [],
    },
    readiness: FieldModel.STATUSES.READINESS.READY,
  });

  this.updateByModel({ silentValidation: true });

  // Send request back about successfully of operation
  this.fieldSlaveChannel.postMessage(
    new Message(PUT_FIELD_RESPONSE, {
      success: true,
      data: {
        fieldStatusPatch: this.fieldModel.status,
      },
    }),
  );
}

export default putFieldHandler;
export {
  putFieldHandler,
};
