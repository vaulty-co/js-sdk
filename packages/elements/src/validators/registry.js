import { VALIDATORS_TYPES } from './constants';
import { RequiredValidator } from './RequiredValidator';
import { CardNumberValidator } from './CardNumberValidator';
import { CardVerificationCodeValidator } from './CardVerificationCodeValidator';
import { CardExpirationDateValidator } from './CardExpirationDateValidator';

const VALIDATORS_REGISTRY = {
  [VALIDATORS_TYPES.REQUIRED]: RequiredValidator,
  [VALIDATORS_TYPES.CARD_NUMBER]: CardNumberValidator,
  [VALIDATORS_TYPES.CARD_VERIFICATION_CODE]: CardVerificationCodeValidator,
  [VALIDATORS_TYPES.CARD_EXPIRATION_DATE]: CardExpirationDateValidator,
};

export default VALIDATORS_REGISTRY;
export {
  VALIDATORS_REGISTRY,
};
