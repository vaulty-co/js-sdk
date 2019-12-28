import { Route } from './Route';
import { Field } from '../fields/Field';

/**
 * Route for Field
 */
class FieldRoute extends Route {
  /**
   * Render route
   * @returns {Field}
   */
  render() {
    const field = this.renderFunction();
    this.constructor.invariant(
      (field instanceof Field),
      `Field route "${this.name}" does not return Field in render function.`,
    );
    return field;
  }
}

export default FieldRoute;
export {
  FieldRoute,
};
