import { FieldModel } from '@vaulty/common/src/models/fields/FieldModel';

/**
 * @class SDKDestroyedField
 */
class DestroyedField {
  appendTo() {}

  update() {}

  /**
   * Get field status
   * @returns {FieldStatus}
   */
  getStatus() {
    return FieldModel.STATUSES.DESTROYED;
  }

  on() {}

  off() {}

  focus() {}

  blur() {}

  clear() {}

  destroy() {}
}

export default DestroyedField;
export {
  DestroyedField,
};
