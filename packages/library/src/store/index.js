import { createStore as reduxCreateStore, combineReducers } from 'redux';

import { fields } from '../fields/reducer';
import { controllers } from '../controllers/reducer';

/**
 * Create store for SDK
 * @returns {Store<{}, AnyAction>}
 */
const createStore = () => (
  reduxCreateStore(
    combineReducers({
      fields,
      controllers,
    }),
    {},
  )
);

export default createStore;
export {
  createStore,
};
