import { immerable } from 'immer';
import { uniqueId } from '@js-sdk/common/src/helpers/uniqueId';

import {
  filterStyles,
} from '../../helpers/filterStyles';
import {
  ALLOWED_STYLED_PROPS,
  FIELD_STATUSES,
  INITIAL_FIELD_STATUS,
  INITIAL_FIELD_SETTINGS,
} from './constants';

/**
 * Field's model
 * @class
 */
class FieldModel {
  static get STATUSES() {
    return FIELD_STATUSES;
  }

  /**
   * @param {FieldModelOptions} [options = {}]
   */
  constructor(options = {}) {
    this[immerable] = true;

    /**
     * @type {string}
     */
    this.id = uniqueId();
    this.type = options.type || 'unknown';
    this.status = INITIAL_FIELD_STATUS;
    this.setSettings(options.settings);
  }

  /**
   * Setup new status for field
   * @param {FieldStatus} newStatus
   */
  setStatus(newStatus) {
    this.status = {
      ...this.status,
      ...newStatus,
    };
  }

  /**
   * Set new settings for field
   * @param {FieldSettings} [newSettings = {}]
   */
  setSettings(newSettings = {}) {
    const previousSettings = this.settings || {};

    const previousStyle = previousSettings.style || INITIAL_FIELD_SETTINGS;
    const newStyle = newSettings.style || INITIAL_FIELD_SETTINGS;

    this.settings = {
      ...previousSettings,
      ...newSettings,
      validators: [
        ...(previousSettings.validators || []),
        ...(newSettings.validators || []),
      ],
      style: {
        ...previousStyle,
        ...filterStyles(newStyle, ALLOWED_STYLED_PROPS),
      },
    };
  }

  /**
   * Get field style
   * @param {string} styleName
   * @returns {string}
   */
  getStyle(styleName) {
    const style = this.settings?.style ?? {};
    return style[styleName] || '';
  }

  /**
   * Prepare plain object for using in JSON.stringify()
   * @returns {FieldModelJSON}
   */
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      settings: this.settings,
    };
  }
}

export default FieldModel;
export {
  FieldModel,
};
