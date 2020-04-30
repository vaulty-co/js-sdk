import { ControllersCollection } from '@js-sdk/common/src/models/controllers/ControllersCollection';
import { getReduxInstancesByModel } from '@js-sdk/library/src/store/utils/getReduxInstancesByModel';

const { actions, reducer } = getReduxInstancesByModel(
  ControllersCollection,
  [
    'addController',
    'removeController',
    'addFieldsToController',
    'removeFieldsFromController',
    'removeFieldsFromControllers',
    'setControllerStatus',
  ],
  new ControllersCollection(),
);

export default {
  actions,
  reducer,
};
export {
  actions,
  reducer,
};
