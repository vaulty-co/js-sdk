import { Required } from '../Required';

describe('RequredValidator', () => {
  let requiredValidator;

  beforeEach(() => {
    requiredValidator = new Required();
  });

  describe('False ->', () => {
    it('when data is null', () => {
      expect(requiredValidator.validate(null)).toBe(false);
    });

    it('when data is undefined', () => {
      expect(requiredValidator.validate(undefined)).toBe(false);
    });

    it('when data is empty string', () => {
      expect(requiredValidator.validate('')).toBe(false);
    });

    it('when data is 0', () => {
      expect(requiredValidator.validate(0)).toBe(false);
    });
  });

  describe('True ->', () => {
    it('when data is not null', () => {
      expect(requiredValidator.validate({})).toBe(true);
    });

    it('when data is not empty string', () => {
      expect(requiredValidator.validate('not empty string')).toBe(true);
    });

    it('when data is not 0 number', () => {
      expect(requiredValidator.validate(1)).toBe(true);
    });
  });
});
