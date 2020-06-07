import { getQueryString } from '@vaulty/elements/src/router/utils/getQueryString';

import { CARD_EXPIRATION_DATE_PARAMS } from './constants';

const queryString = getQueryString(CARD_EXPIRATION_DATE_PARAMS);

export default queryString;
export {
  queryString,
};
