import cardValidator from 'card-validator';
import { Validator } from '@js-sdk/utils/src/validators/Validator';

import { VALIDATORS_TYPES } from './constants';

class CardExpirationDate extends Validator {
  constructor() {
    super(VALIDATORS_TYPES.CARD_EXPIRATION_DATE);
  }

  /**
   * Validate card expiration date
   * @param {string} cardExpirationDate
   * @returns {boolean}
   */
  validate(cardExpirationDate) {
    return (
      typeof cardExpirationDate === 'string'
      && cardValidator.expirationDate(cardExpirationDate).isValid
    );
  }
}

export default CardExpirationDate;
export {
  CardExpirationDate,
};