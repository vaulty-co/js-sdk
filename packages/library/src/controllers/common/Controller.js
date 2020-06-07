import EventEmitter from 'events';
import { staticInvariant } from '@vaulty/common/src/helpers/invariant';
import uniqueId from '@vaulty/common/src/helpers/uniqueId';

import { actionsToDispatch } from '../../store/utils/actionsToDispatch';
import { makeControllerSelector, makeControllerStatusSelector } from './store/selectors';
import { operationCreateController } from './store/operations/createController';
import { operationMountController } from './store/operations/mountController';
import { operationAddFieldsToController } from './store/operations/addFieldsToController';
import { operationRemoveFieldsFromController } from './store/operations/removeFieldsFromController';
import { operationDestroyController } from './store/operations/destroyController';

/**
 * Get fields ids by field instances
 * @param {Array<Field>} [fields = []]
 * @return {Array<string>}
 */
const getFieldsIds = (fields = []) => (
  fields.map(
    (field) => field.id,
  )
);

/**
 * @class SDKController
 */
class Controller {
  static get invariant() {
    return staticInvariant;
  }

  /**
   * @param {SDKControllerOptions|SDKFormOptions} options
   */
  constructor(options) {
    /**
     * @type {string}
     * @protected
     */
    this.id = uniqueId();
    /**
     * @type {SDKControllerOptions}
     * @protected
     */
    this.options = options;
    /**
     * @type {?EventEmitter}
     * @protected
     */
    this.events = new EventEmitter();
    /**
     * @type {?IFrameNode}
     * @protected
     */
    this.controllerIframe = null;
    /**
     * Controller selector
     * @protected
     */
    this.controllerSelector = makeControllerSelector(this.id);
    /**
     * Controller status selector
     * @protected
     */
    this.controllerStatusSelector = makeControllerStatusSelector(this.id);

    /**
     * @type {Object.<string, operation>}
     * @protected
     */
    this.operations = actionsToDispatch(options.store)({
      createController: operationCreateController,
      mountController: operationMountController,
      addFields: operationAddFieldsToController,
      removeFields: operationRemoveFieldsFromController,
      destroyController: operationDestroyController,
    });
    this.operations.createController({
      id: this.id,
      fieldsIds: getFieldsIds(options.fields),
    });

    const state = options.store.getState();
    let currentStatus = this.controllerStatusSelector(state);
    const unsubscribe = options.store.subscribe(() => {
      const newState = options.store.getState();
      const currentController = this.controllerSelector(newState);
      if (!currentController) {
        this.controllerIframe.destroy();
        this.controllerIframe = null;
        this.events.removeAllListeners();
        this.events = null;
        unsubscribe();
      } else {
        const previousStatus = currentStatus;
        currentStatus = this.controllerStatusSelector(newState);
        if (previousStatus !== currentStatus) {
          this.events.emit('status', currentStatus);
        }
      }
    });
  }

  /**
   * Add fields to controller
   * @param {Array<Field>} fields
   */
  addFields(fields) {
    this.operations.addFields(
      getFieldsIds(fields),
    );
  }

  /**
   * Remove fields from controller
   * @param {Array<Field>} fields
   */
  removeFields(fields) {
    this.operations.removeFields(
      getFieldsIds(fields),
    );
  }

  /**
   * Remove fields from controller
   */
  removeAllFields() {
    const controller = this.controllerSelector(this.options.store.getState());
    this.operations.removeFields(controller.fieldsIds);
  }

  /**
   * Append controller in some DOM node
   * @param {string|HTMLElement} parentNode - valid css selector or DOM node, where element should be appended
   */
  appendTo(parentNode) {
    this.constructor.invariant(
      Boolean(this.controllerIframe),
      'IFrameNode should exist in controller',
    );

    this.controllerIframe.appendTo(parentNode);
    this.operations.mountController({
      id: this.id,
      iframeDomNode: this.controllerIframe.node,
    });
  }

  /**
   * Add handler to event
   * @param {string} eventName
   * @param {Function} eventHandler
   * @return {*}
   */
  on(eventName, eventHandler) {
    return this.events.on(eventName, eventHandler);
  }

  /**
   * Remove handler from event
   * @param {string} eventName
   * @param {Function} eventHandler
   * @return {*}
   */
  off(eventName, eventHandler) {
    return this.events.off(eventName, eventHandler);
  }

  /**
   * Get controller status
   * Notice: real readiness is computed value by form readiness and fields readiness
   * @returns {ComputedControllerStatus}
   */
  getStatus() {
    return this.controllerStatusSelector(this.options.store.getState());
  }

  /**
   * Destroy controller and its DOM tree. It does not destroy parent, where controller have been placed.
   * Controller is not usable after destroy
   * @param {boolean} [withFields = false] - destroy controller with its fields
   */
  destroy(withFields) {
    if (typeof withFields === 'undefined') {
      /* eslint no-param-reassign:0 */
      withFields = false;
    }
    this.operations.destroyController({ id: this.id, withFields });
  }
}

export default Controller;
export {
  Controller,
};
