import invariant from 'invariant';

/**
 * @typedef {Object} NodeOptions
 * @property {HTMLElement} node
 */

const ELEMENT_NODE = 1;
const ATTRIBUTE_NODE = 2;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

/**
 * @enum {number}
 */
const NODE_TYPES = {
  ELEMENT_NODE,
  ATTRIBUTE_NODE,
  TEXT_NODE,
  COMMENT_NODE,
};


class Node {
  /**
   * @param {boolean} condition
   * @param {string} message
   */
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  /**
   * @returns {NODE_TYPES}
   */
  static get NODE_TYPES() {
    return NODE_TYPES;
  }

  /**
   * @param {NodeOptions} [options = {}]
   */
  constructor(options = {}) {
    this.node = options.node;
  }

  /**
   * Append node in parent node
   * @param {string|HTMLElement} parentNode - valid css selector or DOM node,
   * where element should be appended
   */
  appendTo(parentNode) {
    let resultParentNode = parentNode;
    if (typeof parentNode === 'string') {
      resultParentNode = document.querySelector(parentNode);
    }
    this.parent = resultParentNode;
    this.constructor.invariant(
      Boolean(this.node),
      'Node should contains "this.node" property for manipulating its',
    );
    this.constructor.invariant(
      typeof resultParentNode === 'object'
      && resultParentNode.nodeType === NODE_TYPES.ELEMENT_NODE,
      'Parent node should be a HTMLElement node',
    );
    resultParentNode.appendChild(this.node);
  }

  /**
   * Add class to node
   * @param {string} className
   */
  addClass(className) {
    const currentClassName = this.node.className;
    if (currentClassName) {
      this.node.className = `${currentClassName} ${className}`;
    } else {
      this.node.className = className;
    }
  }

  /**
   * Remove class from node
   * @param {string} className
   */
  removeClass(className) {
    const classNames = this.node.className.split(' ');
    if (classNames.length) {
      this.node.className = classNames
        .filter((currentClassName) => currentClassName.trim() !== className)
        .join(' ')
        .trim();
    }
  }

  /**
   * Set style to node
   * @param {Object} [style = {}]
   */
  setStyle(style = {}) {
    Object.assign(
      this.node.style,
      style,
    );
  }

  /**
   * Get node value
   * @returns {null}
   */
  getValue() {
    return null;
  }

  /**
   * Add event listener
   * @param {string} eventName
   * @param {function(e:Event)} handler
   */
  on(eventName, handler) {
    this.node.addEventListener(eventName, handler);
  }

  /**
   * Remove event listener
   * @param {string} eventName
   * @param {function(e:Event)} handler
   */
  off(eventName, handler) {
    this.node.removeEventListener(eventName, handler);
  }

  /**
   * Focus node
   */
  focus() {
    this.node.focus();
  }

  /**
   * Blur node
   */
  blur() {
    this.node.blur();
  }

  /**
   * Clear node
   */
  // eslint-disable-line class-methods-use-this
  clear() {

  }

  /**
   * Destroy node
   */
  destroy() {
    if (this.parent) {
      this.parent.removeChild(this.node);
    }

    this.node = null;
    this.parent = null;
  }
}

export default Node;
export {
  Node,
};
