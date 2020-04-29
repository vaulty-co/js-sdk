import { ControllerModel } from '@js-sdk/common/src/models/controllers/ControllerModel';

import { actions } from '../storeArtifacts';

/**
 * Operation for creating controller
 * @param {ControllerModelOptions} options
 * @return {operationResult}
 */
const operationCreateController = (options) => (
  (dispatch) => {
    const { id, fieldsIds } = options;
    const controller = new ControllerModel({
      id,
      fieldsIds,
    });
    dispatch(actions.addController(controller));
  }
);

export default operationCreateController;
export {
  operationCreateController,
};
