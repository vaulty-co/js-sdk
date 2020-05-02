import { ControllerModel } from '@js-sdk/common/src/models/controllers/ControllerModel';

/**
 * @class SDKDestroyedController
 */
class DestroyedController {
  addFields() {}

  removeFields() { }

  removeAllFields() {}

  appendTo() {}

  on() {}

  off() {}

  /**
   * Get destroyed controller
   * @returns {ComputedControllerStatus}
   */
  getStatus() {
    return ControllerModel.STATUSES.DESTROYED;
  }

  destroy() {}
}

export default DestroyedController;
export {
  DestroyedController,
};
