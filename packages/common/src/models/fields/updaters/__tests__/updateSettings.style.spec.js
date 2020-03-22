import { style } from '../updateSettings';
import { INITIAL_FIELD_SETTINGS } from '../../constants';

jest.mock('../../constants', () => ({
  ALLOWED_STYLED_PROPS: ['width', 'height'],
  INITIAL_FIELD_SETTINGS: {
    style: { width: '150px', height: '20px' },
  },
}));

describe('updateSettings.style', () => {
  describe('style is updated', () => {
    it('should return a new style', () => {
      const prevSettings = { style: { width: '10px' } };
      const settings = { style: { height: '10px' } };

      expect(style(prevSettings, settings)).toEqual({ width: '150px', height: '10px' });
    });

    it('should add not provided values from default styles', () => {
      const prevSettings = { style: { width: '10px' } };
      const settings = { style: { width: '20px' } };

      expect(style(prevSettings, settings)).toEqual({ width: '20px', height: '20px' });
    });

    it('should exclude not allowed styles', () => {
      const prevSettings = { style: { width: '10px' } };
      const settings = { style: { background: 'red' } };

      expect(style(prevSettings, settings)).toEqual({ width: '150px', height: '20px' });
    });
  });

  describe('style is not updated', () => {
    it('should return a previous style', () => {
      const prevSettings = { style: { width: '40px', height: '50px' } };
      const settings = {};

      expect(style(prevSettings, settings)).toEqual({ width: '40px', height: '50px' });
    });
  });

  it('should return default style when it is not before and not updated', () => {
    const prevSettings = {};
    const settings = {};

    expect(style(prevSettings, settings)).toEqual(INITIAL_FIELD_SETTINGS.style);
  });
});
