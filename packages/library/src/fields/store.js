import { FieldsCollection } from '@js-sdk/common/src/models/fields/FieldsCollection';

import { getReduxInstancesByModel } from '../store/utils/getReduxInstancesByModel';

const { actions, reducer: fields } = getReduxInstancesByModel(
  FieldsCollection,
  [
    'addField',
    'removeField',
    'setFieldStatus',
  ],
  new FieldsCollection(),
);

export default {
  actions,
  fields,
};
export {
  actions,
  fields,
};
