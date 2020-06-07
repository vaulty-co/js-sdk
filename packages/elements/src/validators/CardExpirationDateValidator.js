import cardValidator from 'card-validator';
import { Validator } from '@vaulty/common/src/validators/Validator';

import { VALIDATORS_TYPES } from './constants';

class CardExpirationDateValidator extends Validator {
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

export default CardExpirationDateValidator;
export {
  CardExpirationDateValidator,
};
