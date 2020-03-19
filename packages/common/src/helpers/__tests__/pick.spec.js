import { pick } from '../pick';

describe('pick', () => {
  const obj = { a: 1, b: '2', c: '3' };

  it('should pick properties from object by properties array', () => {
    expect(pick(obj, ['a', 'b'])).toEqual({ a: 1, b: '2' });
  });

  it('should return empty object, if array of properties are not specified', () => {
    expect(pick(obj)).toEqual({});
  });

  it('should return empty object, if object is not specified', () => {
    expect(pick()).toEqual({});
  });
});
