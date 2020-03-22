import { filterStyles } from '@js-sdk/common/src/helpers/filterStyles';
import { combineUpdaters } from '@js-sdk/common/src/helpers/combineUpdaters';

import {
  ALLOWED_STYLED_PROPS,
  INITIAL_FIELD_SETTINGS,
} from '../constants';

/**
 * Name updater
 * @param {FieldSettings} prevSettings
 * @param {FieldSettings} settings
 * @returns {FieldName}
 */
const name = (prevSettings, settings) => (
  settings.name || prevSettings.name || INITIAL_FIELD_SETTINGS.name
);

/**
 * Disabled updater
 * @param {FieldSettings} prevSettings
 * @param {FieldSettings} settings
 * @returns {boolean}
 */
const disabled = (prevSettings, settings) => {
  const prevDisabled = 'disabled' in prevSettings ? Boolean(prevSettings.disabled) : INITIAL_FIELD_SETTINGS.disabled;

  return (
    'disabled' in settings
      ? Boolean(settings.disabled)
      : prevDisabled
  );
};

/**
 * Style updater
 * @param {FieldSettings} prevSettings
 * @param {FieldSettings} settings
 * @returns {FieldStyles}
 */
const style = (prevSettings, settings) => {
  if (!prevSettings.style && !settings.style) {
    return INITIAL_FIELD_SETTINGS.style;
  }

  if (prevSettings.style && !settings.style) {
    return prevSettings.style;
  }

  if (settings.style) {
    return filterStyles({
      ...INITIAL_FIELD_SETTINGS.style,
      ...settings.style,
    }, ALLOWED_STYLED_PROPS);
  }
};

/**
 * Validators updater
 * @param {FieldSettings} prevSettings
 * @param {FieldSettings} settings
 * @returns {Array<ValidatorName>}
 */
const validators = (prevSettings, settings) => (
  Array.isArray(settings.validators)
    ? settings.validators
    : (prevSettings.validators || INITIAL_FIELD_SETTINGS.validators)
);

const updateSettings = combineUpdaters({
  name,
  disabled,
  style,
  validators,
});

export {
  name,
  disabled,
  style,
  validators,
  updateSettings,
};
