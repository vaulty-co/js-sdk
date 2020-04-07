import { createStore as reduxCreateStore, combineReducers } from 'redux';
import { uniqueId } from '@js-sdk/common/src/helpers/uniqueId';
import { composeWithDevTools } from 'redux-devtools-extension';

import { fields } from '../fields/store';
import { controllers } from '../controllers/store';

let middleware;
if (process.env.NODE_ENV === 'development') {
  middleware = composeWithDevTools();
}

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
    middleware,
  );
};

export default createStore;
export {
  createStore,
};
