import { Route } from './Route';
import { Controller } from '../controllers/Controller';

/**
 * Route for Controller
 */
class ControllerRoute extends Route {
  /**
   * Render route
   * @param {URLSearchParams} queryParams
   * @returns {Controller}
   */
  render(queryParams) {
    const controller = this.renderFunction(queryParams);
    this.constructor.invariant(
      (controller instanceof Controller),
      `Controller route "${this.name}" does not return Controller in render function.`,
    );
    return controller;
  }
}

export default ControllerRoute;
export {
  ControllerRoute,
};
