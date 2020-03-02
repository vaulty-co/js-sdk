import { Node } from '@js-sdk/utils/src/nodes/Node';
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
