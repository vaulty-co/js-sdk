import { createStore as reduxCreateStore, combineReducers, applyMiddleware } from 'redux';
import { uniqueId } from '@js-sdk/common/src/helpers/uniqueId';
import { composeWithDevTools } from 'redux-devtools-extension';

import { fields } from '../fields/common/store/index';
import { controllers } from '../controllers/store';
import { operationsMiddleware } from './middleware/operationsMiddleware/index';

let middleware = applyMiddleware(
  operationsMiddleware,
);
if (process.env.NODE_ENV === 'development') {
  middleware = composeWithDevTools(
    applyMiddleware(
      operationsMiddleware,
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
