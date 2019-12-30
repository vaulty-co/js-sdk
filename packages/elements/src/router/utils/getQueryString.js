import 'url-search-params-polyfill';

/**
 * Gets query string by params
 * @params {Object} params
 * @returns {string}
 */
const getQueryString = (params) => (
  new URLSearchParams(params).toString()
);

export default getQueryString;
export {
  getQueryString,
};
