import 'url-search-params-polyfill';
import invariant from 'invariant';

import { Element } from '../elements/Element';

/**
 * Create route by query params and can render element, when route has match with query params
 */
class Route {
  // FIXME - add decorator for that
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  /**
   * @param {string} name - router name
   * @param {Object} routeParams - map of params and its value, which should be matched for current route
   * @param {Function} render - render function, which provide right element by route
   */
  constructor(name, routeParams, render) {
    this.name = name;
    this.params = routeParams;
    this.renderFunction = render;
  }

  match(queryString) {
    const queryParams = new URLSearchParams(queryString);
    return Object.keys(this.params)
      .every((key) => (
        queryParams.get(key) === this.params[key]
      ));
  }

  /**
   * Render route
   * @returns {?Element}
   */
  render() {
    const element = this.renderFunction();
    this.constructor.invariant(
      (element instanceof Element),
      `Router "${this.name}" does not return Element in render function.`,
    );
    return element;
  }
}

export default Route;
export {
  Route,
};
