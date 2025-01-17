/**
 * Transform actions functions to dispatch store with calling them
 * @param {Store} store
 * @returns {Function}
 */
const actionsToDispatch = (store) => (
  /**
   * @param {Object.<string, ActionCreator|operation>} actionMap
   * @returns {Object.<string, Function>}
   */
  (actionMap = {}) => (
    Object
      .keys(actionMap)
      .reduce((result, actionName) => {
        const newResult = result;
        const actionCreator = actionMap[actionName];
        newResult[actionName] = (...data) => store.dispatch(actionCreator(...data));
        return newResult;
      }, {})
  )
);

export default actionsToDispatch;
export {
  actionsToDispatch,
};
