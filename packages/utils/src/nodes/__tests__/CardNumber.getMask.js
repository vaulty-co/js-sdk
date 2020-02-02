import { getMask } from '../CardNumber';

describe('getMask', () => {
  describe('for one length', () => {
    let card;
    beforeEach(() => {
      card = { lengths: [16] };
    });

    it('should get mask without gaps, if gaps is empty', () => {
      card = { ...card, gaps: [] };

      const actualResult = getMask(card);

      expect(actualResult).toBe('0000000000000000');
    });

    it('should get mask with specified gaps ([4, 8, 11])', () => {
      card = { ...card, gaps: [4, 8, 11] };

      const actualResult = getMask(card);

      expect(actualResult).toBe('0000 0000 000 00000');
    });
  });

  describe('for multi length ([16, 18, 19])', () => {
    let card;
    beforeEach(() => {
      card = { lengths: [16, 18, 19] };
    });

    it('should get mask without gaps, if gaps is empty', () => {
      card = { ...card, gaps: [] };

      const actualResult = getMask(card);

      expect(actualResult).toBe('0000000000000000[000]');
    });

    it('should get mask with specified gaps ([4, 8, 12])', () => {
      card = { ...card, gaps: [4, 8, 12] };

      const actualResult = getMask(card);

      expect(actualResult).toBe('0000 0000 0000 0000[000]');
    });
  });
});
