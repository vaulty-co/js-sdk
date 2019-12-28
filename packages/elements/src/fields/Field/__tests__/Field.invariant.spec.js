import invariant from 'invariant';

import { Field } from '../index';

jest.mock('invariant', () => jest.fn());

describe('Field', () => {
  afterEach(() => {
    invariant.mockClear();
  });

  it('should call invariant with provided condition result', () => {
    Field.invariant(false, 'some message');

    expect(invariant.mock.calls).toHaveLength(1);
    expect(invariant.mock.calls[0][0]).toBe(false);
  });

  it('should provides constructor name in message', () => {
    class MyField extends Field {}

    MyField.invariant(true, 'some message');

    expect(invariant.mock.calls).toHaveLength(1);
    expect(invariant).toBeCalledWith(true, '[MyField] some message');
  });
});
