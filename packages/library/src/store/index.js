import { createStore as reduxCreateStore, combineReducers, applyMiddleware } from 'redux';
import { uniqueId } from '@js-sdk/common/src/helpers/uniqueId';
import { composeWithDevTools } from 'redux-devtools-extension';

import { fields, fieldMiddleware } from '../fields/common/store/index';
import { controllers } from '../controllers/store';

let middleware = applyMiddleware(
  fieldMiddleware,
);
if (process.env.NODE_ENV === 'development') {
  middleware = composeWithDevTools(
    applyMiddleware(
      fieldMiddleware,
    ),
  );
}

/**
 * Create store for SDK
 * @returns {Store<SDKState, AnyAction>}
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
