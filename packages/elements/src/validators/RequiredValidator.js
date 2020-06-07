import { Validator } from '@vaulty/common/src/validators/Validator';

import { VALIDATORS_TYPES } from './constants';

class RequiredValidator extends Validator {
  constructor() {
    super(VALIDATORS_TYPES.REQUIRED);
  }

  /**
   * Validate that data is non falsy
   * @param {*} data
   * @returns {boolean}
   */
  validate(data) {
    return Boolean(data);
  }
}

export default RequiredValidator;
export {
  RequiredValidator,
};
