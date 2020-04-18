import invariant from 'invariant';

/**
 * Invariant, which is used as static class method
 * @param {boolean} condition
 * @param {string} message
 */
function staticInvariant(condition, message) {
  invariant(condition, `[${this.name}] ${message}`);
}

/**
 * Create invariant with prefixed message
 * @param {string} prefix
 */
function createInvariant(prefix) {
  /**
   * @param {boolean} condition
   * @param {string} message
   */
  return function prefixedInvariant(condition, message) {
    invariant(condition, `[${prefix}] ${message}`);
  };
}

export {
  staticInvariant,
  createInvariant,
};
