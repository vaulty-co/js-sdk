import { immerable } from 'immer';

import { ControllerModel } from './ControllerModel';

/**
 * Collect all controllers' models created by SDK and operate by them
 * @class
 */
class ControllersCollection {
  constructor() {
    this[immerable] = true;

    /**
     * @type {Object<ControllerModel>}
     */
    this.controllers = {};
  }

  /**
   * Add controller in collection
   * @param {ControllerModel} controller
   */
  addController(controller) {
    this.controllers[controller.id] = controller;
  }

  /**
   * Remove controller from collection
   * @param {ControllerModel} controller
   */
  removeController(controller) {
    delete this.controllers[controller.id];
  }

  /**
   * Get controller by its id
   * @param {string} controllerId
   * @returns {?ControllerModel}
   */
  getController(controllerId) {
    const controller = this.controllers[controllerId];
    if (controller instanceof ControllerModel) {
      return controller;
    }
    return null;
  }

  /**
   * Add fields to controller by id
   * @param {Object} options
   * @param {string} options.controllerId
   * @param {Array<string>} options.fieldsIds
   */
  addFieldsToController(options = {}) {
    const { controllerId, fieldsIds } = options;
    const controller = this.getController(controllerId);
    if (controller) {
      controller.addFields(fieldsIds);
    }
  }

  /**
   * Remove fields from controller by id
   * @param {Object} options
   * @param {string} options.controllerId
   * @param {Array<string>} options.fieldsIds
   */
  removeFieldsFromController(options = {}) {
    const { controllerId, fieldsIds } = options;
    const controller = this.getController(controllerId);
    if (controller) {
      controller.removeFields(fieldsIds);
    }
  }
}

export default ControllersCollection;
export {
  ControllersCollection,
};
