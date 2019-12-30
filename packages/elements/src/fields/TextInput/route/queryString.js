import { getQueryString } from 'vaulty-js-sdk-elements/src/router/utils/getQueryString';

import { TEXT_INPUT_PARAMS } from './constants';

const queryString = getQueryString(TEXT_INPUT_PARAMS);

export default queryString;
export {
  queryString,
};
