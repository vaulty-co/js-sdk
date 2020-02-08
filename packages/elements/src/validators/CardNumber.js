import cardValidator from 'card-validator';
import { Validator } from '@js-sdk/utils/src/validators/Validator';

import { VALIDATOR_TYPES } from './constants';

class CardNumber extends Validator {
  constructor() {
    super(VALIDATOR_TYPES.CARD_NUMBER);
  }

  /**
   * Validate card number
   * @param {string} cardNumber
   * @returns {boolean}
   */
  validate(cardNumber) {
    return (
      typeof cardNumber === 'string'
      && cardValidator.number(cardNumber).isValid
    );
  }
}

export default CardNumber;
export {
  CardNumber,
};
