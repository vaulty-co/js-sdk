import { Route } from './Route';
import { Element } from '../elements/Element';

/**
 * Route for Element
 */
class ElementRoute extends Route {
  /**
   * Render route
   * @returns {Element}
   */
  render() {
    const element = this.renderFunction();
    this.constructor.invariant(
      (element instanceof Element),
      `Element route "${this.name}" does not return Element in render function.`,
    );
    return element;
  }
}

export default ElementRoute;
export {
  ElementRoute,
};
