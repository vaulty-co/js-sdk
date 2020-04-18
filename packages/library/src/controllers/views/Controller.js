import EventEmitter from 'events';
import { staticInvariant } from '@js-sdk/common/src/helpers/invariant';

/**
 * @class
 */
class Controller {
  static get invariant() {
    return staticInvariant;
  }

  constructor() {
    /**
     * @type {EventEmitter}
     */
    this.events = new EventEmitter();
  }

  /**
   * Append controller in some DOM node
   * @param {string|HTMLElement} parentNode - valid css selector or DOM node, where element should be appended
   */
  appendTo(parentNode) {
    this.controllerIframe.appendTo(parentNode);
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
   * Destroy controller and its DOM tree. It does not destroy parent, where controller have been placed.
   * Controller is not usable after destroy
   */
  destroy() {
    this.controllerIframe.destroy();
    this.controllerIframe = null;

    this.events.removeAllListeners();
  }
}

export default Controller;
export {
  Controller,
};
