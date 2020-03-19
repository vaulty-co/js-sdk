/**
 * Pick properties from object and create a new with them
 * @param {Object} [object = {}]
 * @param {Array} [properties = []]
 * @returns {Object}
 */
const pick = (object = {}, properties = []) => (
  Object.keys(object).reduce(
    (result, property) => {
      const pickedObject = result;
      if (properties.includes(property)) {
        pickedObject[property] = object[property];
      }
      return pickedObject;
    },
    {},
  )
);

export default pick;
export {
  pick,
};
