import { FieldsCollection } from '@vaulty/common/src/models/fields/FieldsCollection';
import { getReduxInstancesByModel } from '@vaulty/library/src/store/utils/getReduxInstancesByModel';

const { actions, reducer } = getReduxInstancesByModel(
  FieldsCollection,
  [
    'addField',
    'removeField',
    'setFieldStatus',
    'setFieldSettings',
  ],
  new FieldsCollection(),
);

export default {
  actions,
  reducer,
};
export {
  actions,
  reducer,
};
