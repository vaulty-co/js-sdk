import { ControllersCollection } from '@vaulty/common/src/models/controllers/ControllersCollection';
import { getReduxInstancesByModel } from '@vaulty/library/src/store/utils/getReduxInstancesByModel';

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
