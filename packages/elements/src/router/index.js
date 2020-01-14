import 'url-search-params-polyfill';
import { createBrowserHistory } from 'history';

/**
 * Call method on each instance
 * @param {Array<ElementsInstance>} instances - collection of elements
 * @param {string} method - method name
 * @param {Array<*>} [args = []]
 * @returns {Array<ElementsInstance>}
 */
const applyToInstances = (instances, method, args = []) => {
  instances.forEach(
    (instance) => instance[method](...args),
  );
  return instances;
};

class Router {
  /**
   * @param {HTMLElement} node - node, where routes' instances should be rendered
   */
  constructor(node) {
    this.node = node;
    this.routes = [];
    this.mountedInstances = [];
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
   * Unmount rendered instances
   * @private
   */
  unmountInstances() {
    if (this.mountedInstances.length) {
      applyToInstances(this.mountedInstances, 'unmount');
      this.mountedInstances = [];
    }
  }

  /**
   * Render instances by matched route
   */
  render() {
    this.unmountInstances();
    const queryParams = new URLSearchParams(this.locationSearch);
    this.mountedInstances = this.routes.reduce(
      /**
       * @param {Array<ElementsInstance>} instances
       * @param {Route} route
       */
      (instances, route) => {
        if (route.match(queryParams)) {
          instances.push(
            route.render(queryParams),
          );
        }
        return instances;
      },
      [],
    );
    applyToInstances(this.mountedInstances, 'mount', [this.node]);
  }

  destroy() {
    this.historyUnlisten();
    this.unmountInstances();
  }
}

export default Router;
export {
  Router,
};
