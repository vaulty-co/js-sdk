import 'url-search-params-polyfill';
import { staticInvariant } from '@vaulty/common/src/helpers/invariant';

/**
 * Create route by query params and can render instance, when route has match with query params
 */
class Route {
  static get invariant() {
    return staticInvariant;
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
   * @param {URLSearchParams} queryParams
   * @returns {boolean}
   */
  match(queryParams) {
    return Object.keys(this.params)
      .every((key) => (
        queryParams.get(key) === this.params[key]
      ));
  }

  /**
   * Render route
   * @param {URLSearchParams} queryParams
   * @returns {*}
   */
  render(queryParams) {
    return this.renderFunction(queryParams);
  }
}

export default Route;
export {
  Route,
};
