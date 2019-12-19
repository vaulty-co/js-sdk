import styles from './styles.scss';

/**
 * It renders simple text input node
 * @class
 */
class TextInput {
  constructor() {
    const node = document.createElement('input');
    node.setAttribute('type', 'text');
    node.className = styles.input;

    this.node = node;
  }

  /**
   * Append node to parent element
   * @param {HTMLElement} parent - parent node
   */
  appendTo(parent) {
    this.parent = parent;
    parent.appendChild(this.node);
  }

  /**
   * Destroy input element and remove its from parent, if it is specified
   */
  destroy() {
    if (this.parent) {
      this.parent.removeChild(this.node);
    }
    this.node = null;
    this.parent = null;
  }
}

export default TextInput;
export {
  TextInput,
};
