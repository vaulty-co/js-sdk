import { VALIDATORS_TYPES } from './constants';
import { Required } from './Required';
import { CardNumber } from './CardNumber';

const VALIDATORS_REGISTRY = {
  [VALIDATORS_TYPES.REQUIRED]: Required,
  [VALIDATORS_TYPES.CARD_NUMBER]: CardNumber,
};

export default VALIDATORS_REGISTRY;
export {
  VALIDATORS_REGISTRY,
};
