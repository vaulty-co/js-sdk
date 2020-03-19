import { immerable } from 'immer';
import { uniqueId } from '@js-sdk/common/src/helpers/uniqueId';
import { filterStyles } from '@js-sdk/common/src/helpers/filterStyles';
import { pick } from '@js-sdk/common/src/helpers/pick';

import {
  ALLOWED_STYLED_PROPS,
  FIELD_STATUSES,
  INITIAL_FIELD_STATUS,
  DEFAULT_FIELD_STYLES,
} from './constants';

const ALLOWED_MODEL_JSON_PROPERTIES = ['id', 'type', 'status', 'settings'];

/**
 * Field's model
 * @class
 */
class FieldModel {
  static get STATUSES() {
    return FIELD_STATUSES;
  }

  /**
   * Create FiledModel by its JSON
   * @param {FieldModelJSON} modelJSON
   */
  static of(modelJSON) {
    /**
     * @type {FieldModelOptions}
     */
    const fieldModelOptions = pick(modelJSON, ALLOWED_MODEL_JSON_PROPERTIES);
    return new FieldModel(fieldModelOptions);
  }

  /**
   * @param {FieldModelOptions} [options = {}]
   */
  constructor(options = {}) {
    this[immerable] = true;

    this.id = options.id || uniqueId();
    this.type = options.type || 'unknown';
    this.status = options.status || INITIAL_FIELD_STATUS;
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

    const previousStyle = previousSettings.style || DEFAULT_FIELD_STYLES;
    const newStyle = newSettings.style || DEFAULT_FIELD_STYLES;

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
   * Get field name
   * @returns {?string}
   */
  getName() {
    return this.settings?.name;
  }

  /**
   * Get field style
   * @param {string} [styleName]
   * @returns {string|Object}
   */
  getStyle(styleName) {
    const style = this.settings?.style ?? {};
    if (!styleName) {
      return style;
    }
    return style[styleName] || '';
  }

  /**
   * Get field validators
   * @returns {Array<ValidatorName>}
   */
  getValidators() {
    return this.settings?.validators ?? [];
  }

  /**
   * Prepare a plain object for using in JSON.stringify()
   * @returns {FieldModelJSON}
   */
  toJSON() {
    return pick(this, ALLOWED_MODEL_JSON_PROPERTIES);
  }
}

export default FieldModel;
export {
  FieldModel,
};
