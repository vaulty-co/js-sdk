import { immerable } from 'immer';
import uniqueId from 'lodash/uniqueId';
import get from 'lodash/get';

/**
 * FieldModel statuses
 * @enum {string}
 */
const FIELD_MODEL_STATUSES = {
  INITIALIZED: 'initialized',
  MOUNTED: 'mount',
  LOADING: 'loading',
  LOADING_ERROR: 'loading_error',
  READY: 'ready',
  DESTROYED: 'destroyed',
};

/**
 * @typedef {Object} FieldModelOptions
 * @property {string} [type='unknown'] - type of field
 */

/**
 * Field's model
 * @class
 */
class FieldModel {
  static get STATUSES() {
    return FIELD_MODEL_STATUSES;
  }

  /**
   * @param {FieldModelOptions} [options = {}]
   */
  constructor(options = {}) {
    this[immerable] = true;

    /**
     * @type {string}
     */
    this.id = uniqueId('field-');
    /**
     * @type {string}
     */
    this.type = get(options, 'type', 'unknown');
    /**
     * @type {FIELD_MODEL_STATUSES}
     */
    this.status = FIELD_MODEL_STATUSES.INITIALIZED;
  }

  /**
   * Setup new status for field
   * @param {FIELD_MODEL_STATUSES} newStatus
   */
  setStatus(newStatus) {
    this.status = newStatus;
  }
}

export default FieldModel;
export {
  FieldModel,
};
