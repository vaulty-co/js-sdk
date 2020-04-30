import { CardNumberNode } from './nodes/CardNumberNode';
import { InputField } from '../common/InputField';

/**
 * It renders simple text input node
 * @class CardNumberElement
 * @extends InputFieldElement
 */
class CardNumber extends InputField {
  constructor(options) {
    const node = new CardNumberNode();

    super({
      ...options,
      node,
    });
  }
}

export default CardNumber;
export {
  CardNumber,
};
