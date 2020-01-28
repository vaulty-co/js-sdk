import uuid from 'uuid/v4';

/**
 * Generate unique ID with excluding collisions
 * @param {string} prefix
 * @returns {string}
 */
function uniqueId(prefix = '') {
  return `${prefix}${uuid()}`;
}

export default uniqueId;
export {
  uniqueId,
};
