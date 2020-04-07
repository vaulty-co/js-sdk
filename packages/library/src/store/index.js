import { createStore as reduxCreateStore, combineReducers } from 'redux';
import { uniqueId } from '@js-sdk/common/src/helpers/uniqueId';

import { fields } from '../fields/store';
import { controllers } from '../controllers/store';

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
