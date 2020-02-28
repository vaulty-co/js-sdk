import { Validator } from '@js-sdk/utils/src/validators/Validator';

import { VALIDATORS_TYPES } from './constants';

class CardVerificationCode extends Validator {
  constructor() {
    super(VALIDATORS_TYPES.CARD_VERIFICATION_CODE);
  }

  /**
   * Validate card verification code
   * @param {string} cardNumber
   * @returns {boolean}
   */
  validate(cardNumber) {
    return (
      typeof cardNumber === 'string'
      && cardNumber.length >= 3
    );
  }
}

export default CardVerificationCode;
export {
  CardVerificationCode,
};
