import { immerable } from 'immer';
import { uniqueId } from '@js-sdk/common/src/helpers/uniqueId';
import { pick } from '../../helpers/pick';

import {
  CONTROLLER_STATUSES,
  INITIAL_CONTROLLER_STATUS,
} from './constants';

const ALLOWED_MODEL_JSON_PROPERTIES = ['id', 'fieldsIds', 'status'];

/**
 * Controller's model
 * @class
 */
class ControllerModel {
  /**
   * Get controller statuses
   * @return {Object}
   * @constructor
   */
  static get STATUSES() {
    return CONTROLLER_STATUSES;
  }

  /**
   * Create ControllerModel by its JSON
   * @param {ControllerModelJSON} modelJSON
   */
  static of(modelJSON) {
    /**
     * @type {ControllerModelOptions}
     */
    const controllerModelOptions = pick(modelJSON, ALLOWED_MODEL_JSON_PROPERTIES);
    return new ControllerModel(controllerModelOptions);
  }

  /**
   * @param {ControllerModelOptions} options
   */
  constructor(options = {}) {
    const {
      fieldsIds = [],
    } = options;

    this[immerable] = true;

    /**
     * @type {string}
     */
    this.id = options.id || uniqueId();
    /**
     * @type {Array<string>}
     */
    this.fieldsIds = fieldsIds || [];
    /**
     * @type {ControllerStatus}
     */
    this.status = options.status || INITIAL_CONTROLLER_STATUS;
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

  /**
   * Set controller status
   * @param {ControllerStatus} status
   */
  setStatus(status) {
    this.status = {
      ...this.status,
      ...status,
    };
  }

  /**
   * Prepare a plain object for using in JSON.stringify()
   * @returns {ControllerModelJSON}
   */
  toJSON() {
    return pick(this, ALLOWED_MODEL_JSON_PROPERTIES);
  }
}

export default ControllerModel;
export {
  ControllerModel,
};
