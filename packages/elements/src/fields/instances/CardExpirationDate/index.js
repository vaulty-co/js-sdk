import cardValidator from 'card-validator';

import { CardExpirationDateNode } from './nodes/CardExpirationDateNode';
import { InputField } from '../../common/InputField';

/**
 * It renders card expiration date input
 * @class CardExpirationDateElement
 * @extends InputFieldElement
 */
class CardExpirationDate extends InputField {
  constructor(options) {
    const node = new CardExpirationDateNode();

    super({
      ...options,
      node,
    });
  }

  /**
   * Get data for sending its to controller
   * @returns {{id: string, name: FieldName, data: { month: string, year: string }}}
   */
  getData() {
    const { month, year } = cardValidator.expirationDate(
      this.fieldNode.getValue(),
    );
    return {
      id: this.fieldModel.id,
      name: this.fieldModel.getName(),
      data: {
        month,
        year,
      },
    };
  }
}

export default CardExpirationDate;
export {
  CardExpirationDate,
};
