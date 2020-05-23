import { CardVerificationCodeNode } from './nodes/CardVerificationCodeNode';
import { InputField } from '../../common/InputField';

/**
 * It renders card verification code input
 * @class CardVerificationCodeElement
 * @extends InputFieldElement
 */
class CardVerificationCode extends InputField {
  constructor(options) {
    const node = new CardVerificationCodeNode();

    super({
      ...options,
      node,
    });
  }
}

export default CardVerificationCode;
export {
  CardVerificationCode,
};
