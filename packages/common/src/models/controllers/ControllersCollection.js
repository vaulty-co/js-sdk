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
   * Iterate by controllers
   * @param {function(ControllerModel): undefined} iterator
   */
  forEach(iterator) {
    Object.keys(this.controllers).forEach((controllerId) => {
      iterator(this.controllers[controllerId]);
    });
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

  /**
   * Remove fields from controllers
   * @param {Object} options
   * @param {Array<string>} options.fieldsIds
   */
  removeFieldsFromControllers(options = {}) {
    const { fieldsIds } = options;
    Object
      .keys(this.controllers)
      .forEach((controllerId) => {
        const controller = this.controllers[controllerId];
        controller.removeFields(fieldsIds);
      });
  }

  /**
   * Set controller status
   * @param {Object} options
   * @param {string} options.controllerId
   * @param {ControllerStatus} options.status
   */
  setControllerStatus(options) {
    const { controllerId, status } = options;
    const controller = this.getController(controllerId);
    if (controller) {
      controller.setStatus(status);
    }
  }
}

export default ControllersCollection;
export {
  ControllersCollection,
};
