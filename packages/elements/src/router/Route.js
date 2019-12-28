import 'url-search-params-polyfill';
import invariant from 'invariant';

/**
 * Create route by query params and can render instance, when route has match with query params
 */
class Route {
  // FIXME - add decorator for that
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  /**
   * @param {string} name - router name
   * @param {Object} routeParams - map of params and its value, which should be matched for current route
   * @param {Function} render - render function, which provide right instance by route
   */
  constructor(name, routeParams, render) {
    this.name = name;
    this.params = routeParams;
    this.renderFunction = render;
  }

  /**
   * Match route with query string
   * @param {string} queryString
   * @returns {boolean}
   */
  match(queryString) {
    const queryParams = new URLSearchParams(queryString);
    return Object.keys(this.params)
      .every((key) => (
        queryParams.get(key) === this.params[key]
      ));
  }

  /**
   * Gets query string by router params
   * @returns {string}
   */
  getQueryString() {
    return new URLSearchParams(this.params).toString();
  }

  /**
   * Render route
   * @returns {*}
   */
  render() {
    return this.renderFunction();
  }
}

export default Route;
export {
  Route,
};