import { createAction } from 'redux-actions';

const addField = createAction('addField');
const removeField = createAction('removeField');
const setFieldStatus = createAction('setFieldStatus');

export {
  addField,
  removeField,
  setFieldStatus,
};
