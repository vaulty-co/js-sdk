import invariant from 'invariant';

import { NODE_TYPES } from '../constants/nodeTypes';

const STATUSES = {
  INIT: 'init',
  DESTROYED: 'destroyed',
};

/**
 * Base class for Field
 * @class
 * @extends {ElementsInstance}
 */
class Field {
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
      'Node for field should be a HTMLElement',
    );

    this.status = STATUSES.INIT;
    this.node = node;
  }

  /**
   * Mount field
   * @param {HTMLElement} node
   */
  mount(node) {
    this.appendTo(node);
  }

  /**
   * Unmount field
   */
  unmount() {
    this.destroy();
  }

  /**
   * Append field node to parent node
   * @param {HTMLElement} parent - parent node
   */
  appendTo(parent) {
    if (this.status === STATUSES.DESTROYED) {
      this.constructor.invariant(
        false,
        'Field is destroyed and can not be append to a parent node.',
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
   * Destroy field and remove its from parent, if it is specified
   */
  destroy() {
    if (this.status === STATUSES.DESTROYED) {
      this.constructor.invariant(
        false,
        'Field is destroyed and can not be destroyed again.',
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

export default Field;
export {
  Field,
};
