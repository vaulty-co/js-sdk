let counter = 0;

function uniqueId(prefix = '') {
  counter += 1;
  return `${prefix}${counter}`;
}

export default uniqueId;
export {
  uniqueId,
};
