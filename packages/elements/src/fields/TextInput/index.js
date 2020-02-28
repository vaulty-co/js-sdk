import { TextNode } from '@js-sdk/elements/src/nodes/TextNode';

import { InputField } from '../common/InputField';

/**
 * It renders simple text input node
 * @class
 */
class TextInput extends InputField {
  constructor(options) {
    const node = new TextNode();

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
