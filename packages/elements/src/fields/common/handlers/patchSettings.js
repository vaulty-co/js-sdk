import { Message } from '@js-sdk/common/src/channels/Message';
import { PATCH_FIELD_SETTINGS_RESPONSE } from '../Field/messages';

function patchSettingsHandler(message) {
  const {
    payload: {
      /**
       * @type {FieldSettings}
       */
      fieldSettingsPatch,
    },
  } = message;

  this.fieldModel.setSettings(fieldSettingsPatch);
  this.updateByModel();
  this.fieldSlaveChannel.postMessage(
    new Message(
      PATCH_FIELD_SETTINGS_RESPONSE,
      {
        success: true,
        data: {
          fieldStatusPatch: this.fieldModel.status,
        },
      },
    ),
  );
}

export default patchSettingsHandler;
export {
  patchSettingsHandler,
};
