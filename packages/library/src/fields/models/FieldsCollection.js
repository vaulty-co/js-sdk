import { immerable } from 'immer';

import { FieldModel } from './FieldModel';

/**
 * Collect all fields models created by SDK and operate by them
 * @class
 */
class FieldsCollection {
  constructor() {
    this[immerable] = true;

    /**
     * @type {Object<FieldModel>}
     */
    this.fields = {};
  }

  /**
   * Add field in collection
   * @param {FieldModel} field
   */
  addField(field) {
    this.fields[field.id] = field;
  }

  /**
   * Remove field from collection
   * @param {FieldModel} field
   */
  removeField(field) {
    delete this.fields[field.id];
  }

  /**
   * Get field by its id
   * @param {string} fieldId
   * @returns {?FieldModel}
   */
  getField(fieldId) {
    const field = this.fields[fieldId];
    if (field instanceof FieldModel) {
      return field;
    }
    return null;
  }

  /**
   * Set status in specific field
   * @param {Object} options
   * @param {string} options.fieldId
   * @param {FIELD_MODEL_STATUSES} options.status
   */
  setFieldStatus(options) {
    const { fieldId, status } = options;
    const field = this.getField(fieldId);
    if (field) {
      field.setStatus(status);
    }
  }
}

export default FieldsCollection;
export {
  FieldsCollection,
};
