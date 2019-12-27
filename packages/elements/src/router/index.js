import { createBrowserHistory } from 'history';

/**
 * Call method on each element
 * @param {Array<Element>} elements - collection of elements
 * @param {string} method - method name
 * @param {Array<*>} [args = []]
 * @returns {Array<Element>}
 */
const applyToElements = (elements, method, args = []) => {
  elements.forEach(
    /**
     * @param {Element} element
     */
    (element) => element[method](...args),
  );
  return elements;
};

class Router {
  /**
   * @param {HTMLElement} node - node, where elements from routes should be rendered
   */
  constructor(node) {
    this.node = node;
    this.routes = [];
    this.mountedElements = [];
    this.history = createBrowserHistory({
      forceRefresh: false,
    });
    this.locationSearch = this.history.location.search;
    this.historyUnlisten = this.history.listen((location) => {
      if (location.search !== this.locationSearch) {
        this.locationSearch = location.search;
        this.render();
      }
    });
  }

  /**
   * Register route in router
   * @param {Route} route
   */
  register(route) {
    this.routes.push(route);
  }

  /**
   * Remove route from router
   * @param {Route} removedRoute - route for removing
   */
  unregister(removedRoute) {
    this.routes = this.routes.filter(
      /**
       * @param {Route} route
       * @returns {boolean}
       */
      (route) => route !== removedRoute,
    );
  }

  /**
   * Remove rendered elements
   * @private
   */
  unmountElements() {
    if (this.mountedElements.length) {
      applyToElements(this.mountedElements, 'destroy');
      this.mountedElements = [];
    }
  }

  /**
   * Render elements by matched route
   */
  render() {
    this.unmountElements();
    this.mountedElements = this.routes.reduce(
      /**
       * @param {Array<Element>} elements
       * @param {Route} route
       */
      (elements, route) => {
        if (route.match(this.locationSearch)) {
          elements.push(
            route.render(),
          );
        }
        return elements;
      },
      [],
    );
    applyToElements(this.mountedElements, 'appendTo', [this.node]);
  }

  destroy() {
    this.historyUnlisten();
    this.unmountElements();
  }
}

export default Router;
export {
  Router,
};
