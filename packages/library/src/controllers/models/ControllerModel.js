import { immerable } from 'immer';
import memoizeOne from 'memoize-one';
import { uniqueId } from '@js-sdk/utils/src/helpers/uniqueId';

import { FIELD_READINESS_STATUSES, FIELD_VALIDATION_STATUSES } from '../../fields/constants';
import {
  CONTROLLER_STATUSES,
  CONTROLLER_NODE_STATUSES,
  CONTROLLER_READINESS_STATUSES,
  CONTROLLER_VALIDATION_STATUSES,
} from '../constants';

/**
 * @typedef {Object} ControllerStatus
 * @property {CONTROLLER_NODE_STATUSES} [node]
 * @property {CONTROLLER_VALIDATION_STATUSES} [validation]
 * @property {CONTROLLER_READINESS_STATUSES} [readiness]
 */

/**
 * Controller's model
 * @class
 */
class ControllerModel {
  static get STATUSES() {
    return CONTROLLER_STATUSES;
  }

  constructor(options = {}) {
    const {
      fieldsIds = [],
    } = options;

    this[immerable] = true;

    /**
     * @type {string}
     */
    this.id = uniqueId();
    /**
     * @type {Array<string>}
     */
    this.fieldsIds = fieldsIds;
    /**
     * @type {ControllerStatus}
     */
    this.status = {
      node: CONTROLLER_NODE_STATUSES.UNMOUNTED,
      validation: CONTROLLER_VALIDATION_STATUSES.UNKNOWN,
      readiness: CONTROLLER_READINESS_STATUSES.LOADING,
    };

    this.getFormStatusByFields = memoizeOne(
      this.getFormStatusByFields,
      /**
       * Compare fields collections in controller context
       * @param {FieldsCollection} newCollection
       * @param {FieldsCollection} lastCollection
       * @returns {boolean}
       */
      ([newCollection], [lastCollection]) => {
        if (newCollection === lastCollection) {
          return true;
        }

        return this.fieldsIds.every((fieldId) => (
          newCollection.getField(fieldId) === lastCollection.getField(fieldId)
        ));
      },
    );
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
   * Get form status by fields status
   * Notice: memoized
   * @param {FieldsCollection} fieldsCollection
   * @return {ControllerStatus}
   */
  getFormStatusByFields(fieldsCollection) {
    const fields = this.fieldsIds.map((fieldId) => (
      fieldsCollection.getField(fieldId)
    ));
    const isReady = fields.every((field) => (
      field.status.readiness === FIELD_READINESS_STATUSES.READY
    ));
    const isValid = fields.every((field) => (
      field.status.validation.status === FIELD_VALIDATION_STATUSES.VALID
    ));
    if (isReady) {
      return {
        readiness: CONTROLLER_READINESS_STATUSES.READY,
        validation: isValid
          ? CONTROLLER_VALIDATION_STATUSES.VALID
          : CONTROLLER_VALIDATION_STATUSES.INVALID,
      };
    }
    return {
      readiness: CONTROLLER_READINESS_STATUSES.LOADING,
      validation: CONTROLLER_VALIDATION_STATUSES.UNKNOWN,
    };
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
}

export default ControllerModel;
export {
  ControllerModel,
};
