import invariant from 'invariant';

import { NODE_TYPES } from '../constants/nodeTypes';

const STATUSES = {
  INIT: 'init',
  DESTROYED: 'destroyed',
};

/**
 * Base class for Elements
 * @class
 * @extends {VaultyElementsInstance}
 */
class Element {
  /**
   * @param {boolean} condition
   * @param {string} message
   */
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  static get STATUSES() {
    return STATUSES;
  }

  /**
   * @param {HTMLElement} node
   */
  constructor(node) {
    this.constructor.invariant(
      typeof node === 'object' && node.nodeType === NODE_TYPES.ELEMENT_NODE,
      'Node for element should be a HTMLElement',
    );

    this.status = STATUSES.INIT;
    this.node = node;
  }

  /**
   * Mount element
   * @param {HTMLElement} node
   */
  mount(node) {
    this.appendTo(node);
  }

  /**
   * Unmount element
   */
  unmount() {
    this.destroy();
  }

  /**
   * Append node to parent element
   * @param {HTMLElement} parent - parent node
   */
  appendTo(parent) {
    if (this.status === STATUSES.DESTROYED) {
      this.constructor.invariant(
        false,
        'Element is destroyed and can not be append to a parent node.',
      );
      return;
    }

    this.constructor.invariant(
      typeof parent === 'object' && parent.nodeType === NODE_TYPES.ELEMENT_NODE,
      'Parent node should be a HTMLElement node',
    );

    this.parent = parent;
    parent.appendChild(this.node);
  }

  /**
   * Destroy element and remove its from parent, if it is specified
   */
  destroy() {
    if (this.status === STATUSES.DESTROYED) {
      this.constructor.invariant(
        false,
        'Element is destroyed and can not be destroyed again.',
      );
      return;
    }

    if (this.parent) {
      this.parent.removeChild(this.node);
    }
    this.status = STATUSES.DESTROYED;
    this.node = null;
    this.parent = null;
  }
}

export default Element;
export {
  Element,
};
