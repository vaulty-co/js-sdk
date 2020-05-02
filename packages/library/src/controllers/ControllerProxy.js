import { DestroyedController } from './common/DestroyedController';
import { makeControllerSelector } from './common/store/selectors';
import { Controller } from './common/Controller';
import { Form } from './instances/Form/index';

const CONTROLLER_TYPES = {
  form: Form,
};

/**
 * @class SDKControllerProxy
 */
class ControllerProxy {
  /**
   * @param {controllerType} type
   * @param {SDKControllerOptions|SDKFormOptions} options
   */
  constructor(type, options = {}) {
    const ControllerInstance = CONTROLLER_TYPES[type];
    if (ControllerInstance) {
      this.controller = new ControllerInstance(options);
    } else {
      // FIXME - here should be some error handler for SDK user
      this.controller = new Controller(options);
    }
    /**
     * @type {string}
     */
    this.id = this.controller.id;
    /**
     * Controller selector
     * @type {controllerSelector}
     * @protected
     */
    this.controllerSelector = makeControllerSelector(this.controller.id);

    const unsubscribe = options.store.subscribe(() => {
      const controller = this.controllerSelector(options.store.getState());
      if (!controller) {
        this.controller = new DestroyedController();
        unsubscribe();
      }
    });
  }

  /**
   * Add fields to controller
   * @param {Array<Field>} fields
   */
  addFields(fields) {
    return this.controller.addFields(fields);
  }

  /**
   * Remove fields from controller
   * @param {Array<Field>} fields
   */
  removeFields(fields) {
    return this.controller.removeFields(fields);
  }

  /**
   * Remove fields from controller
   */
  removeAllFields() {
    return this.controller.removeAllFields();
  }

  /**
   * Append controller in some DOM node
   * @param {string|HTMLElement} parentNode - valid css selector or DOM node, where element should be appended
   */
  appendTo(parentNode) {
    return this.controller.appendTo(parentNode);
  }

  /**
   * Add handler to event
   * @param {string} eventName
   * @param {Function} eventHandler
   * @return {*}
   */
  on(eventName, eventHandler) {
    return this.controller.on(eventName, eventHandler);
  }

  /**
   * Remove handler from event
   * @param {string} eventName
   * @param {Function} eventHandler
   * @return {*}
   */
  off(eventName, eventHandler) {
    return this.controller.off(eventName, eventHandler);
  }

  /**
   * Get controller status
   * Notice: real readiness is computed value by form readiness and fields readiness
   * @returns {ComputedControllerStatus}
   */
  getStatus() {
    return this.controller.getStatus();
  }

  /**
   * Destroy controller and its DOM tree. It does not destroy parent, where controller have been placed.
   * Controller is not usable after destroy
   * @param {boolean} [withFields = false] - destroy controller with its fields
   */
  destroy(withFields) {
    return this.controller.destroy(withFields);
  }
}

export default ControllerProxy;
export {
  CONTROLLER_TYPES,
  ControllerProxy,
};
