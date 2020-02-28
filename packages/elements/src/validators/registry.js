import { VALIDATORS_TYPES } from './constants';
import { Required } from './Required';
import { CardNumber } from './CardNumber';
import { CardVerificationCode } from './CardVerificationCode';

const VALIDATORS_REGISTRY = {
  [VALIDATORS_TYPES.REQUIRED]: Required,
  [VALIDATORS_TYPES.CARD_NUMBER]: CardNumber,
  [VALIDATORS_TYPES.CARD_VERIFICATION_CODE]: CardVerificationCode,
};

export default VALIDATORS_REGISTRY;
export {
  VALIDATORS_REGISTRY,
};
