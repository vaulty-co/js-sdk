import { FieldsCollection } from '@js-sdk/common/src/models/fields/FieldsCollection';
import { getReduxInstancesByModel } from '@js-sdk/library/src/store/utils/getReduxInstancesByModel';

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
