import invariant from 'invariant';

import { NODE_TYPES } from '../constants/nodeTypes';

/**
 * Base class for Elements
 * @class
 */
class Element {
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  /**
   * @param {HTMLElement} node
   */
  constructor(node) {
    this.constructor.invariant(
      typeof node === 'object' && node.nodeType === NODE_TYPES.ELEMENT_NODE,
      'Node for element should be a HTMLElement',
    );

    this.node = node;
  }

  /**
   * Append node to parent element
   * @param {HTMLElement} parent - parent node
   */
  appendTo(parent) {
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
    if (this.parent) {
      this.parent.removeChild(this.node);
    }
    this.node = null;
    this.parent = null;
  }
}

export default Element;
export {
  Element,
};
