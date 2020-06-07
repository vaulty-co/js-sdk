import { Message } from '@vaulty/common/src/channels/Message';
import {
  PATCH_FIELD_SETTINGS_REQUEST,
  PATCH_FIELD_STATUS_RESPONSE,
} from '@vaulty/elements/src/fields/common/Field/messages';

import { actions } from '../storeArtifacts';

/**
 * Operation for updating field's settings
 * @param {string} id
 * @param {FieldSettings} settings
 * @return {operationResult}
 */
const operationUpdateFieldSettings = ({ id, settings }) => (
  (dispatch, getState, channels) => {
    const fieldChannel = channels.getChannel(id);
    dispatch(actions.setFieldSettings({ fieldId: id, settings }));
    fieldChannel.postMessage(new Message(
      PATCH_FIELD_SETTINGS_REQUEST,
      {
        fieldSettingsPatch: settings,
      },
    ));
    fieldChannel.subscribe(PATCH_FIELD_STATUS_RESPONSE, (message) => {
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
  }
);

export default operationUpdateFieldSettings;
export {
  operationUpdateFieldSettings,
};
