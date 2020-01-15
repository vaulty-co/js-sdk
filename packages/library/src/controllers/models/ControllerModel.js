import { immerable } from 'immer';

import { uniqueId } from '../../helpers/uniqueId';
import { FieldModel } from '../../fields/models/FieldModel';

/**
 * ControllerModel statuses
 * @enum {string}
 */
const CONTROLLER_MODEL_STATUSES = {
  INITIALIZED: 'initialized',
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
   * Get controller status
   * @param {FieldsCollection} fieldsCollection
   * @return {CONTROLLER_MODEL_STATUSES}
   */
  getStatus(fieldsCollection) {
    const fields = this.fieldsIds.map((fieldId) => (
      fieldsCollection.getField(fieldId)
    ));
    const isReady = fields.every((field) => (
      field.status === FieldModel.STATUSES.READY
    ));
    return isReady ? CONTROLLER_MODEL_STATUSES.READY : CONTROLLER_MODEL_STATUSES.INITIALIZED;
  }
}

export default ControllerModel;
export {
  ControllerModel,
};
