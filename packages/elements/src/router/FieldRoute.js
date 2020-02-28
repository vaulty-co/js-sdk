import { Route } from './Route';
import { Field } from '../fields/common/Field';

/**
 * Route for Field
 */
class FieldRoute extends Route {
  /**
   * Render route
   * @param {URLSearchParams} queryParams
   * @returns {Field}
   */
  render(queryParams) {
    const field = this.renderFunction(queryParams);
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
