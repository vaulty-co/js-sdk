import { createAction } from 'redux-actions';

const addController = createAction('addController');
const removeController = createAction('removeController');
const addFieldsToController = createAction('addFieldsToController');
const removeFieldsFromController = createAction('removeFieldsFromController');
const setControllerStatus = createAction('setControllerStatus');

export {
  addController,
  removeController,
  addFieldsToController,
  removeFieldsFromController,
  setControllerStatus,
};
