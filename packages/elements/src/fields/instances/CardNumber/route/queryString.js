import { getQueryString } from '@vaulty/elements/src/router/utils/getQueryString';

import { CARD_NUMBER_PARAMS } from './constants';

const queryString = getQueryString(CARD_NUMBER_PARAMS);

export default queryString;
export {
  queryString,
};
