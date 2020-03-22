import { disabled } from '../updateSettings';
import { INITIAL_FIELD_SETTINGS } from '../../constants';

describe('updateSettings.disabled', () => {
  it('should return a new disabled state, when it is updated', () => {
    const prevSettings = { disabled: false };
    const settings = { disabled: true };

    expect(disabled(prevSettings, settings)).toBe(true);
  });

  it('should return a previous disabled state, when it is not updated', () => {
    const prevSettings = { disabled: true };
    const settings = {};

    expect(disabled(prevSettings, settings)).toBe(true);
  });

  it('should return a new disabled state, when it is not specified before and updated', () => {
    const prevSettings = {};
    const settings = { disabled: true };

    expect(disabled(prevSettings, settings)).toBe(true);
  });

  it('should return false, when it is not specified before and not updated', () => {
    const prevSettings = {};
    const settings = {};

    expect(disabled(prevSettings, settings)).toBe(INITIAL_FIELD_SETTINGS.disabled);
  });
});
