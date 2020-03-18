import { handleActions } from 'redux-actions';
import produce from 'immer';
import { FieldsCollection } from '@js-sdk/common/src/models/fields/FieldsCollection';

import {
  addField,
  removeField,
  setFieldStatus,
} from './actions';

// TODO - think about convention and decreasing this boilerplate
const fields = handleActions({
  [addField]: produce((state, { payload: field }) => (
    state.addField(field)
  )),
  [removeField]: produce((state, { payload: field }) => (
    state.removeField(field)
  )),
  [setFieldStatus]: produce((state, { payload: { fieldId, status } }) => (
    state.setFieldStatus({ fieldId, status })
  )),
}, new FieldsCollection());

export default fields;
export {
  fields,
};
