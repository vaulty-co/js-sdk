import { Validator } from '@js-sdk/common/src/validators/Validator';

import { VALIDATORS_TYPES } from './constants';

class CardVerificationCodeValidator extends Validator {
  constructor() {
    super(VALIDATORS_TYPES.CARD_VERIFICATION_CODE);
  }

  /**
   * Validate card verification code
   * @param {string} cardVerificationCode
   * @returns {boolean}
   */
  validate(cardVerificationCode) {
    return (
      typeof cardVerificationCode === 'string'
      && cardVerificationCode.length > 2
      && cardVerificationCode.length < 5
    );
  }
}

export default CardVerificationCodeValidator;
export {
  CardVerificationCodeValidator,
};
