import { getReduxInstancesByModel } from '@js-sdk/library/src/store/utils/getReduxInstancesByModel';

import { ConfigModel } from './model';

const { actions, reducer } = getReduxInstancesByModel(
  ConfigModel,
  [
    'addConfig',
  ],
  new ConfigModel(),
);

export default {
  actions,
  reducer,
};
export {
  actions,
  reducer,
};