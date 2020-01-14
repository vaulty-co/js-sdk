import { Field } from '../Field';
import styles from './styles.scss';

/**
 * It renders simple text input node
 * @class
 */
class TextInput extends Field {
  constructor(options) {
    const node = document.createElement('input');
    node.setAttribute('type', 'text');
    node.className = styles.input;

    super({
      ...options,
      node,
    });
  }
}

export default TextInput;
export {
  TextInput,
};
