// FIXME - disabling eslint should be removed after creating behavior for methods
/* eslint-disable class-methods-use-this */
/**
 * Controller base class
 * @class
 * @extends {ElementsInstance}
 */
class Controller {
  /**
   * Mount controller
   */
  mount() {
  }

  /**
   * Unmount controller
   */
  unmount() {
    this.destroy();
  }

  /**
   * Destroy controller
   */
  destroy() {
  }
}

export default Controller;
export {
  Controller,
};
