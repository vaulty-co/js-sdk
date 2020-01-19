import { handleActions } from 'redux-actions';
import produce from 'immer';

import { ControllersCollection } from './models/ControllersCollection';
import {
  addController,
  removeController,
  addFieldsToController,
  removeFieldsFromController,
  setControllerStatus,
} from './actions';

// TODO - think about convention and decreasing this boilerplate
const controllers = handleActions({
  [addController]: produce((state, { payload: controller }) => (
    state.addController(controller)
  )),
  [removeController]: produce((state, { payload: controller }) => (
    state.removeController(controller)
  )),
  [addFieldsToController]: produce((state, { payload: { controllerId, fieldsIds } }) => (
    state.addFieldsToController({ controllerId, fieldsIds })
  )),
  [removeFieldsFromController]: produce((state, { payload: { controllerId, fieldsIds } }) => (
    state.removeFieldsFromController({ controllerId, fieldsIds })
  )),
  [setControllerStatus]: produce((state, { payload: { controllerId, status } }) => (
    state.setControllerStatus({ controllerId, status })
  )),
}, new ControllersCollection());

export default controllers;
export {
  controllers,
};
