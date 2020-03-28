import { Node } from '@js-sdk/common/src/nodes/Node';
import styles from './styles.scss';

/**
 * @typedef {Object} TextNodeOptions
 * @property {string} type - type of text node
 */

/**
 * Create text node with using <input /> element
 * @class
 */
class TextNode extends Node {
  /**
   * @param {TextNodeOptions} [options = {}]
   */
  constructor(options = {}) {
    const { type = 'text' } = options;
    const node = document.createElement('input');
    node.setAttribute('type', type);

    super({
      ...options,
      node,
    });

    this.addClass(styles.input);
  }

  /**
   * Set attributes to input
   * @param {FieldAttributes} fieldAttributes
   */
  setAttributes(fieldAttributes) {
    if (fieldAttributes.disabled) {
      this.node.setAttribute('disabled', '');
    } else {
      this.node.removeAttribute('disabled');
    }

    if (fieldAttributes.placeholder) {
      this.node.setAttribute('placeholder', fieldAttributes.placeholder);
    } else {
      this.node.removeAttribute('placeholder');
    }
  }

  /**
   * Get text input value
   */
  getValue() {
    return this.node.value;
  }

  /**
   * Clear text node
   */
  clear() {
    this.node.value = '';
  }
}

export default TextNode;
export {
  TextNode,
};
