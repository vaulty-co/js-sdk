/* eslint-disable max-classes-per-file */
import { Validator } from '../Validator';
import { ComposedValidator } from '../ComposedValidator';

class Required extends Validator {
  constructor() {
    super('required');
  }

  validate(data) {
    return Boolean(data);
  }
}

class Integer extends Validator {
  constructor() {
    super('integer');
  }

  validate(data) {
    return !Number.isNaN(
      parseInt(data, 10),
    );
  }
}

describe('ComposedValidator', () => {
  it('should compose validators and return valid state for positive validation', () => {
    const required = new Required();
    const integer = new Integer();

    const composedValidator = new ComposedValidator([required, integer]);

    expect(composedValidator.validate('5')).toHaveProperty('isValid', true);
  });

  it('should compose validators and return valid state for negative validation', () => {
    const required = new Required();
    const integer = new Integer();

    const composedValidator = new ComposedValidator([required, integer]);

    expect(composedValidator.validate('abc')).toHaveProperty('isValid', false);
  });

  it('should prepare data about separate validator status', () => {
    const required = new Required();
    const integer = new Integer();

    const composedValidator = new ComposedValidator([required, integer]);

    expect(composedValidator.validate('abc')).toHaveProperty('validators', [
      { type: 'required', isValid: true },
      { type: 'integer', isValid: false },
    ]);
  });
});
