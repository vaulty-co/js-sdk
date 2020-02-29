import cardValidator from 'card-validator';

import { CardExpirationDate } from '../CardExpirationDate';

jest.mock('card-validator', () => ({
  expirationDate: jest.fn(() => ({ isValid: true })),
}));

describe('CardExpirationDateValidator', () => {
  let cardExpirationDateValidtor;

  beforeEach(() => {
    cardExpirationDateValidtor = new CardExpirationDate();
  });

  afterEach(() => {
    cardValidator.expirationDate.mockImplementation(() => ({ isValid: true }));
  });

  describe('False ->', () => {
    it('when cardExpirationDate is not string', () => {
      expect(cardExpirationDateValidtor.validate(12)).toBe(false);
    });

    it('when cardExpirationDate is not valid expiration date', () => {
      cardValidator.expirationDate.mockImplementation(() => ({ isValid: false }));

      expect(cardExpirationDateValidtor.validate('12/1811')).toBe(false);
    });
  });

  describe('True ->', () => {
    it('when cardExpirationDate is string and a valid expiration date', () => {
      expect(cardExpirationDateValidtor.validate('12/20')).toBe(true);
    });
  });
});
