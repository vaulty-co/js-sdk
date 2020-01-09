import reduce from 'lodash/reduce';

/**
 * Transform actions functions to dispatch store with calling them
 * @param {Store} store
 * @returns {Function}
 */
const actionsToDispatch = (store) => (
  /**
   * @param {Object<ActionCreator>} actionMap
   * @returns {Object<Function>}
   */
  (actionMap = {}) => (
    reduce(actionMap, (result, actionCreator, actionName) => {
      const newResult = result;
      newResult[actionName] = (...data) => store.dispatch(actionCreator(...data));
      return newResult;
    }, {})
  )
);

export default actionsToDispatch;
export {
  actionsToDispatch,
};
