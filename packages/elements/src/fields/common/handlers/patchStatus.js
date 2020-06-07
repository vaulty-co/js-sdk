import { FieldModel } from '@vaulty/common/src/models/fields/FieldModel';
import { Message } from '@vaulty/common/src/channels/Message';

import { PATCH_FIELD_STATUS_RESPONSE } from '../Field/messages';

/**
 * Handler for patching status
 * @this Field
 * @param {Message} message
 */
function patchStatusHandler(message) {
  const {
    payload: {
      /**
       * @type {FieldStatus}
       */
      fieldStatusPatch,
    },
  } = message;
  const errors = [];
  const previousStatus = this.fieldModel.status;
  this.fieldModel.setStatus(fieldStatusPatch);
  const currentStatus = this.fieldModel.status;
  if (previousStatus.focus !== currentStatus.focus) {
    switch (currentStatus.focus) {
      case FieldModel.STATUSES.FOCUS.UNFOCUSED:
        this.blurField();
        break;
      case FieldModel.STATUSES.FOCUS.FOCUSED:
        this.focusField();
        break;
      default:
        errors.push({
          prop: 'focus',
          error: `not applicable data ${currentStatus.focus}`,
        });
        break;
    }
  }
  if (previousStatus.content !== currentStatus.content) {
    switch (currentStatus.content) {
      case FieldModel.STATUSES.CONTENT.EMPTY:
        this.clearField();
        break;
      default:
        errors.push({
          prop: 'content',
          error: `not applicable data ${currentStatus.content}`,
        });
        break;
    }
  }
  if (errors.length) {
    this.fieldSlaveChannel.postMessage(
      new Message(
        PATCH_FIELD_STATUS_RESPONSE,
        {
          error: true,
          data: errors,
        },
      ),
    );
  } else {
    this.fieldSlaveChannel.postMessage(
      new Message(
        PATCH_FIELD_STATUS_RESPONSE,
        {
          success: true,
          data: {
            fieldStatusPatch: this.fieldModel.status,
          },
        },
      ),
    );
  }
}

export default patchStatusHandler;
export {
  patchStatusHandler,
};
