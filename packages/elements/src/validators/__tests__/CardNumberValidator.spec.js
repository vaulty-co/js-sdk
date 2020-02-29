import cardValidator from 'card-validator';

import { CardNumberValidator } from '../CardNumberValidator';

jest.mock('card-validator', () => ({
  number: jest.fn(() => ({ isValid: true })),
}));

describe('CardNumberValidator', () => {
  let cardNumberValidator;

  beforeEach(() => {
    cardNumberValidator = new CardNumberValidator();
  });

  afterEach(() => {
    cardValidator.number.mockImplementation(() => ({ isValid: true }));
  });

  describe('False ->', () => {
    it('when cardNumber is not string', () => {
      expect(cardNumberValidator.validate(5)).toBe(false);
    });

    it('when cardNumber is not valid card', () => {
      cardValidator.number.mockImplementation(() => ({ isValid: false }));

      expect(cardNumberValidator.validate('4111')).toBe(false);
    });
  });

  describe('True ->', () => {
    it('when cardNumber is string and a valid card', () => {
      expect(cardNumberValidator.validate('411111111111')).toBe(true);
    });
  });
});
