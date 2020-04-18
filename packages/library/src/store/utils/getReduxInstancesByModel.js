import { createInvariant } from '@js-sdk/common/src/helpers/invariant';
import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';

const innerInvariant = createInvariant('getReduxInstances');

/**
 * Convert methods list to actions
 * @param {Function} Model - constructor of model
 * @param {Array<string>} methods
 * @return {Object}
 */
const methodsToActions = (Model, methods) => (
  methods.reduce((resultActions, method) => {
    innerInvariant(
      Model.prototype[method],
      `Can not create action for unspecified method '${method}' of model '${Model.name}'`,
    );

    return {
      [method]: createAction(method),
      ...resultActions,
    };
  }, {})
);

/**
 * Get reducer and actions by model instance and methods list
 * @param {Function} Model - constructor of model
 * @param {Array<string>} methods - list of methods, which should be used by actions
 * @param {Object} initialState
 * @return {{reducer: Function, actions: Object}}
 */
const getReduxInstancesByModel = (Model, methods = [], initialState) => {
  const actions = methodsToActions(Model, methods);
  const reducer = handleActions(
    methods.reduce((resultReducer, method) => ({
      [method]: produce(
        (state, { payload }) => state[method](payload),
      ),
      ...resultReducer,
    }), {}),
    initialState,
  );
  return {
    actions,
    reducer,
  };
};

export default {
  getReduxInstancesByModel,
};
export {
  getReduxInstancesByModel,
};
