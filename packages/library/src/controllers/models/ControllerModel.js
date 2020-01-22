import { immerable } from 'immer';

import { uniqueId } from '../../helpers/uniqueId';
import { FIELD_READINESS_STATUSES } from '../../fields/constants';

/**
 * ControllerModel statuses
 * @enum {string}
 */
const CONTROLLER_MODEL_STATUSES = {
  INITIALIZED: 'initialized',
  PROCESSING: 'processing',
  READY: 'ready',
};

/**
 * Controller's model
 * @class
 */
class ControllerModel {
  static get STATUSES() {
    return CONTROLLER_MODEL_STATUSES;
  }

  constructor(options = {}) {
    const {
      fieldsIds = [],
    } = options;

    this[immerable] = true;

    /**
     * @type {string}
     */
    this.id = uniqueId('form-');
    /**
     * @type {Array<string>}
     */
    this.fieldsIds = fieldsIds;
  }

  /**
   * Add fields to controller
   */
  addFields(fieldsIds) {
    this.fieldsIds = this.fieldsIds.concat(fieldsIds);
  }

  /**
   * Remove fields from controller
   */
  removeFields(fieldsIds) {
    this.fieldsIds = this.fieldsIds.filter((fieldId) => !fieldsIds.includes(fieldId));
  }

  // TODO - add memoization
  /**
   * Get fields status
   * @param {FieldsCollection} fieldsCollection
   * @return {CONTROLLER_MODEL_STATUSES}
   */
  getFieldsStatus(fieldsCollection) {
    const fields = this.fieldsIds.map((fieldId) => (
      fieldsCollection.getField(fieldId)
    ));
    const isReady = fields.every((field) => (
      field.status.readiness === FIELD_READINESS_STATUSES.READY
    ));
    return isReady ? CONTROLLER_MODEL_STATUSES.READY : CONTROLLER_MODEL_STATUSES.INITIALIZED;
  }

  /**
   * Set controller status
   * @param {CONTROLLER_MODEL_STATUSES} status
   */
  setStatus(status) {
    this.status = status;
  }
}

export default ControllerModel;
export {
  ControllerModel,
};
