import { Element } from '../Element';
import styles from './styles.scss';

/**
 * It renders simple text input node
 * @class
 */
class TextInput extends Element {
  constructor() {
    const node = document.createElement('input');
    node.setAttribute('type', 'text');
    node.className = styles.input;

    super(node);
  }
}

export default TextInput;
export {
  TextInput,
};
