import { getQueryString } from '@vaulty/elements/src/router/utils/getQueryString';

import { FORM_PARAMS } from './constants';

const queryString = getQueryString(FORM_PARAMS);

export default queryString;
export {
  queryString,
};
