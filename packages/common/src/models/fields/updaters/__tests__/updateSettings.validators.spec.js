import { validators } from '../updateSettings';
import { INITIAL_FIELD_SETTINGS } from '../../constants';

describe('updateSettings.validators', () => {
  it('should return new validators, when it is updated', () => {
    const prevSettings = { validators: ['prevValidator'] };
    const settings = { validators: ['newValidator'] };

    expect(validators(prevSettings, settings)).toEqual(['newValidator']);
  });

  it('should return a previous validators, when it is not updated', () => {
    const prevSettings = { validators: ['prevValidator'] };
    const settings = {};

    expect(validators(prevSettings, settings)).toEqual(['prevValidator']);
  });

  it('should return a new validators, when it is not specified before and updated', () => {
    const prevSettings = {};
    const settings = { validators: ['newValidator'] };

    expect(validators(prevSettings, settings)).toEqual(['newValidator']);
  });

  it('should return empty array, when it is not specified before and not updated', () => {
    const prevSettings = {};
    const settings = {};

    expect(validators(prevSettings, settings)).toEqual(INITIAL_FIELD_SETTINGS.validators);
  });
});
