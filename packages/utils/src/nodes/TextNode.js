import { Node } from './Node';

/**
 * Create text node with using <input /> element
 * @class
 */
class TextNode extends Node {
  /**
   * @param {Object} [options = {}]
   * @param {string} [options.type = 'text']
   */
  constructor(options = {}) {
    const { type = 'text' } = options;
    const node = document.createElement('input');
    node.setAttribute('type', type);

    super({
      ...options,
      node,
    });
  }

  /**
   * Get text input value
   */
  getValue() {
    return this.node.value;
  }
}

export default TextNode;
export {
  TextNode,
};
