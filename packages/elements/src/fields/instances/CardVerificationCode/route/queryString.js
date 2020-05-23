import { getQueryString } from '@js-sdk/elements/src/router/utils/getQueryString';

import { CARD_VERIFICATION_CODE_PARAMS } from './constants';

const queryString = getQueryString(CARD_VERIFICATION_CODE_PARAMS);

export default queryString;
export {
  queryString,
};
