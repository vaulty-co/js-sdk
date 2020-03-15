/**
 * Validator
 * @class
 */
class Validator {
  /**
   * @param {string} type - type of validator
   */
  constructor(type) {
    this.type = type;
  }

  /**
   * Validate data
   * @param {*} data
   * @returns {boolean}
   */
  validate(data) { // eslint-disable-line no-unused-vars
    return true;
  }
}

export default Validator;
export {
  Validator,
};
