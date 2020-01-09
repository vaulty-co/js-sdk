import { createStore as reduxCreateStore, combineReducers } from 'redux';

import { fields } from '../fields/reducer';

/**
 * Create store for SDK
 * @returns {Store<{}, AnyAction>}
 */
const createStore = () => (
  reduxCreateStore(
    combineReducers({
      fields,
    }),
    {},
  )
);

export default createStore;
export {
  createStore,
};
