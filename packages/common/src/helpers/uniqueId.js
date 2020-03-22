import { v4 as uuid } from 'uuid';

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
