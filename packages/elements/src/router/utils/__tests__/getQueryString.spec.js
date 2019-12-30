import { getQueryString } from '../getQueryString';

describe('getQueryString', () => {
  it('should return query string by route params', () => {
    expect(getQueryString({ field: 'input', type: 'text' })).toBe('field=input&type=text');
  });
});
