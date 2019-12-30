// FIXME - disabling eslint should be removed after creating behavior for methods
/* eslint-disable class-methods-use-this */
import invariant from 'invariant';
import { NODE_TYPES } from '../constants/nodeTypes';

class VaultyController {
  /**
   * @param {boolean} condition
   * @param {string} message
   */
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  /**
   * Append Vaulty controller in some DOM node
   * @param {string|HTMLElement} node - valid css selector or DOM node, where element should be appended
   */
  appendTo(node) {
    // TODO - it should be some util
    let resultNode = node;
    if (typeof node === 'string') {
      resultNode = document.querySelector(node);
    }
    this.parent = node;
    this.constructor.invariant(
      this.controllerIframe,
      'Controller should contains "controllerIframe" property for manipulating its',
    );
    this.constructor.invariant(
      typeof resultNode === 'object'
      // TODO - NODE_TYPE should be placed in utils
      && resultNode.nodeType === NODE_TYPES.ELEMENT_NODE,
      'Controller should be "appendTo" HTMLElement',
    );
    this.controllerIframe.appendTo(this.parent);
  }

  /**
   * Destroy controller and its DOM tree. It does not destroy parent, where controller have been placed.
   * Controller is not usable after destroy
   */
  destroy() {
    this.controllerIframe.destroy();

    this.parent = null;
    this.controllerIframe = null;
  }
}

export default VaultyController;
export {
  VaultyController,
};
