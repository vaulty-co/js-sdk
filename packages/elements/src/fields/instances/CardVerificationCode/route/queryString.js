import { getQueryString } from '@vaulty/elements/src/router/utils/getQueryString';

import { CARD_VERIFICATION_CODE_PARAMS } from './constants';

const queryString = getQueryString(CARD_VERIFICATION_CODE_PARAMS);

export default queryString;
export {
  queryString,
};
