import { Validator } from '@js-sdk/utils/src/validators/Validator';

import { VALIDATORS_TYPES } from './constants';

class CardVerificationCode extends Validator {
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
      && cardVerificationCode.length >= 3
    );
  }
}

export default CardVerificationCode;
export {
  CardVerificationCode,
};
