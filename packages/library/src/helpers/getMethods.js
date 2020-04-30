const getMethods = (obj, level) => {
  const properties = new Set();
  let currentLevel = 1;
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj)
      .map((item) => properties.add(item));
    currentObj = Object.getPrototypeOf(currentObj);
    currentLevel += 1;
  } while (currentObj && currentLevel <= level);
  return [...properties.keys()].filter((item) => typeof obj[item] === 'function');
};

export default getMethods;
export {
  getMethods,
};
