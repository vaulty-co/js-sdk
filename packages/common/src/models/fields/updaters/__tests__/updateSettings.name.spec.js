import { name } from '../updateSettings';
import { INITIAL_FIELD_SETTINGS } from '../../constants';

describe('updateSettings.name', () => {
  it('should return a new name, when it is updated', () => {
    const prevSettings = { name: 'prevName' };
    const settings = { name: 'newName' };

    expect(name(prevSettings, settings)).toBe('newName');
  });

  it('should return a previous name, when it is not updated', () => {
    const prevSettings = { name: 'prevName' };
    const settings = {};

    expect(name(prevSettings, settings)).toBe('prevName');
  });

  it('should return a new name, when it is not specified before and updated', () => {
    const prevSettings = {};
    const settings = { name: 'newName' };

    expect(name(prevSettings, settings)).toBe('newName');
  });

  it('should return undefined, when it is not specified before and not updated', () => {
    const prevSettings = {};
    const settings = {};

    expect(name(prevSettings, settings)).toBeUndefined(INITIAL_FIELD_SETTINGS.name);
  });
});
