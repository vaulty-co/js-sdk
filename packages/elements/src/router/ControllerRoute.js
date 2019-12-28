import { Route } from './Route';
import { Controller } from '../controllers/Controller';

/**
 * Route for Controller
 */
class ControllerRoute extends Route {
  /**
   * Render route
   * @returns {Controller}
   */
  render() {
    const controller = this.renderFunction();
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
