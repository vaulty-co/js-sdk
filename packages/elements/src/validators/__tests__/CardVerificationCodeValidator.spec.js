import { CardVerificationCodeValidator } from '../CardVerificationCodeValidator';

describe('CardVerificationCodeValidtor', () => {
  let cardVerificationCodeValidator;

  beforeEach(() => {
    cardVerificationCodeValidator = new CardVerificationCodeValidator();
  });

  describe('False ->', () => {
    it('when cardVerificationCode is not string', () => {
      expect(cardVerificationCodeValidator.validate(345)).toBe(false);
    });

    it('when length of cardVerificationCode less than 3 symbols', () => {
      expect(cardVerificationCodeValidator.validate('34')).toBe(false);
    });

    it('when length of cardVerificationCode more than 4 symbols', () => {
      expect(cardVerificationCodeValidator.validate('34452')).toBe(false);
    });
  });

  describe('True ->', () => {
    it('when cardVerificationCode is string and length is 3 symbol', () => {
      expect(cardVerificationCodeValidator.validate('345')).toBe(true);
    });

    it('when cardVerificationCode is string and length is 4 symbol', () => {
      expect(cardVerificationCodeValidator.validate('3451')).toBe(true);
    });
  });
});
