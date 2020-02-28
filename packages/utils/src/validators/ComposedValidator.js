/**
 * @typedef {Object} ValidatorResult
 * @property {string} type - validator type
 * @property {boolean} isValid - validation result
 */
/**
 * @typedef {Object} ComposedValidationResult
 * @property {Array<ValidatorResult>} validators
 * @property {boolean} isValid
 */

/**
 * Composer for validators
 * @class
 */
class ComposedValidator {
  /**
   * @param {Array<Validator>} validators
   */
  constructor(validators = []) {
    this.validators = validators;
  }

  /**
   * Validate data
   * @param {*} data
   * @returns {ComposedValidationResult}
   */
  validate(data) {
    const result = this.validators.map(
      (validator) => ({
        type: validator.type,
        isValid: validator.validate(data),
      }),
    );

    return {
      validators: result,
      isValid: result.every((validatorResult) => validatorResult.isValid),
    };
  }
}

export default ComposedValidator;
export {
  ComposedValidator,
};
