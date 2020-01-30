import { Node } from './Node';

class TextNode extends Node {
  constructor(options = {}) {
    const node = document.createElement('input');
    node.setAttribute('type', 'text');

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
