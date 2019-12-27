import invariant from 'invariant';

import { Element } from '../index';

jest.mock('invariant', () => jest.fn());

describe('Element', () => {
  afterEach(() => {
    invariant.mockClear();
  });

  it('should call invariant with provided condition result', () => {
    Element.invariant(false, 'some message');

    expect(invariant.mock.calls).toHaveLength(1);
    expect(invariant.mock.calls[0][0]).toBe(false);
  });

  it('should provides constructor name in message', () => {
    class MyElement extends Element {}

    MyElement.invariant(true, 'some message');

    expect(invariant.mock.calls).toHaveLength(1);
    expect(invariant).toBeCalledWith(true, '[MyElement] some message');
  });
});
