import { ControllersCollection } from '@js-sdk/common/src/models/controllers/ControllersCollection';

import { getReduxInstancesByModel } from '../store/utils/getReduxInstancesByModel';

const { actions, reducer: controllers } = getReduxInstancesByModel(
  ControllersCollection,
  [
    'addController',
    'removeController',
    'addFieldsToController',
    'removeFieldsFromController',
    'setControllerStatus',
  ],
  new ControllersCollection(),
);

export default {
  actions,
  controllers,
};
export {
  actions,
  controllers,
};
