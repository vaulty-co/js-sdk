/**
 * Combine updaters by their map
 * @param {Object<string, Function>}updaters
 * @returns {function(Object, Object): Object}
 */
const combineUpdaters = (updaters) => (prev = {}, next = {}) => (
  Object.keys(updaters).reduce(
    (result, updaterName) => {
      const combinedSettings = result;
      combinedSettings[updaterName] = updaters[updaterName](prev, next);
      return combinedSettings;
    },
    {},
  )
);

export default combineUpdaters;
export {
  combineUpdaters,
};
