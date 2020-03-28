import { placeholder } from '../updateSettings';
import { INITIAL_FIELD_SETTINGS } from '../../constants';

describe('updateSettings.placeholder', () => {
  it('should return a new placeholder, when it is updated', () => {
    const prevSettings = { placeholder: 'prevPlaceholder' };
    const settings = { placeholder: 'newPlaceholder' };

    expect(placeholder(prevSettings, settings)).toBe('newPlaceholder');
  });

  it('should return null, when it is updated not by string value', () => {
    const prevSettings = { placeholder: 'prevPlaceholder' };
    const settings = { placeholder: { notString: true } };

    expect(placeholder(prevSettings, settings)).toBe('prevPlaceholder');
  });

  it('should return a previous placeholder, when it is not updated', () => {
    const prevSettings = { placeholder: 'prevPlaceholder' };
    const settings = {};

    expect(placeholder(prevSettings, settings)).toBe('prevPlaceholder');
  });

  it('should return a new placeholder, when it is not specified before and updated', () => {
    const prevSettings = {};
    const settings = { placeholder: 'newPlaceholder' };

    expect(placeholder(prevSettings, settings)).toBe('newPlaceholder');
  });

  it('should return null, when it is not specified before and not updated', () => {
    const prevSettings = {};
    const settings = {};

    expect(placeholder(prevSettings, settings)).toEqual(INITIAL_FIELD_SETTINGS.placeholder);
  });
});
