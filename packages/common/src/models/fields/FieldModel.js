import { immerable } from 'immer';
import { uniqueId } from '@js-sdk/common/src/helpers/uniqueId';
import { pick } from '@js-sdk/common/src/helpers/pick';

import {
  FIELD_STATUSES,
  INITIAL_FIELD_STATUS,
} from './constants';
import {
  updateSettings,
} from './updaters/updateSettings';

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
    this.settings = updateSettings(this.settings, newSettings);
    this.setStatus({
      enabling: (
        this.settings.disabled
          ? FIELD_STATUSES.ENABLING.DISABLED
          : FIELD_STATUSES.ENABLING.ENABLED
      ),
    });
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
   * Get field attributes
   * @returns {FieldAttributes}
   */
  getAttributes() {
    return {
      disabled: this.settings?.disabled ?? false,
    };
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
