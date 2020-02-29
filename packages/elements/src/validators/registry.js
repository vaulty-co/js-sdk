import { VALIDATORS_TYPES } from './constants';
import { Required } from './Required';
import { CardNumber } from './CardNumber';
import { CardVerificationCode } from './CardVerificationCode';
import { CardExpirationDate } from './CardExpirationDate';

const VALIDATORS_REGISTRY = {
  [VALIDATORS_TYPES.REQUIRED]: Required,
  [VALIDATORS_TYPES.CARD_NUMBER]: CardNumber,
  [VALIDATORS_TYPES.CARD_VERIFICATION_CODE]: CardVerificationCode,
  [VALIDATORS_TYPES.CARD_EXPIRATION_DATE]: CardExpirationDate,
};

export default VALIDATORS_REGISTRY;
export {
  VALIDATORS_REGISTRY,
};
