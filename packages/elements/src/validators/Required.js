import { Validator } from '@js-sdk/utils/src/validators/Validator';

import { VALIDATOR_TYPES } from './constants';

class Required extends Validator {
  constructor() {
    super(VALIDATOR_TYPES.REQUIRED);
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

export default Required;
export {
  Required,
};
