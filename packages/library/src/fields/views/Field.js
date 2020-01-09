// FIXME - disabling eslint should be removed after creating behavior for methods
/* eslint-disable class-methods-use-this */
import invariant from 'invariant';
import get from 'lodash/get';

import { NODE_TYPES } from '../../constants/nodeTypes';

/**
 * @typedef {Object} FieldOptions
 * @property {string} name - field name. It is used for sending data from field in Form.
 */

/**
 * @class
 */
class Field {
  /**
   * @param {FieldOptions} options
   */
  constructor(options) {
    this.name = get(options, 'name');
  }

  /**
   * @param {boolean} condition
   * @param {string} message
   */
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  /**
   * Append field in some DOM node
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
      this.fieldIframe,
      'Field should contains "fieldIframe" property for manipulating its',
    );
    this.constructor.invariant(
      typeof resultNode === 'object'
      // TODO - NODE_TYPE should be placed in utils
      && resultNode.nodeType === NODE_TYPES.ELEMENT_NODE,
      'Field should be "appendTo" HTMLElement',
    );
    this.fieldIframe.appendTo(this.parent);
  }

  /**
   * Focus field
   */
  focus() {}

  /**
   * Blur field
   */
  blur() {}

  /**
   * Clear field value
   */
  clear() {}

  /**
   * Destroy field and its DOM tree. It does not destroy parent, where field have been placed.
   * Field is not usable after destroy
   */
  destroy() {
    this.fieldIframe.destroy();

    this.parent = null;
    this.fieldIframe = null;
  }
}

export default Field;
export {
  Field,
};
