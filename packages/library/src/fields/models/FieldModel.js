import { immerable } from 'immer';
import { uniqueId } from '@js-sdk/utils/src/helpers/uniqueId';

import {
  FIELD_NODE_STATUSES,
  FIELD_CONTENT_STATUSES,
  FIELD_VALIDATION_STATUSES,
  FIELD_READINESS_STATUSES,
  FIELD_FOCUS_STATUSES,
} from '../constants';

/**
 * @typedef {Object} FieldStatus
 * @property {FIELD_NODE_STATUSES} [node]
 * @property {FIELD_CONTENT_STATUSES} [content]
 * @property {FIELD_VALIDATION_STATUSES} [validation]
 * @property {FIELD_READINESS_STATUSES} [readiness]
 * @property {FIELD_FOCUS_STATUSES} [focus]
 */

/**
 * @typedef {Object} FieldModelOptions
 * @property {string} [type='unknown'] - type of field
 */

/**
 * Field's model
 * @class
 */
class FieldModel {
  /**
   * @param {FieldModelOptions} [options = {}]
   */
  constructor(options = {}) {
    this[immerable] = true;

    /**
     * @type {string}
     */
    this.id = uniqueId();
    /**
     * @type {string}
     */
    this.type = options?.type ?? 'unknown';
    /**
     * @type {FieldStatus}
     */
    this.status = {
      node: FIELD_NODE_STATUSES.UNMOUNTED,
      content: FIELD_CONTENT_STATUSES.EMPTY,
      validation: FIELD_VALIDATION_STATUSES.UNKNOWN,
      readiness: FIELD_READINESS_STATUSES.READY,
      focus: FIELD_FOCUS_STATUSES.UNFOCUSED,
    };
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
}

export default FieldModel;
export {
  FieldModel,
};
