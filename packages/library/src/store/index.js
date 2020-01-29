import { createStore as reduxCreateStore, combineReducers } from 'redux';
import { uniqueId } from '@js-sdk/utils/src/helpers/uniqueId';

import { fields } from '../fields/reducer';
import { controllers } from '../controllers/reducer';

/**
 * Create store for SDK
 * @returns {Store<{}, AnyAction>}
 */
const createStore = () => {
  const initialSdkId = uniqueId();

  return reduxCreateStore(
    combineReducers({
      sdkId: (state = initialSdkId) => state,
      fields,
      controllers,
    }),
  );
};

export default createStore;
export {
  createStore,
};
