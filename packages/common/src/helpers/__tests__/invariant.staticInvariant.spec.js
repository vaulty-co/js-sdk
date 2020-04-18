/* eslint-disable max-classes-per-file */
import invariant from 'invariant';

import { staticInvariant } from '../invariant';

jest.mock('invariant', () => jest.fn());

class SomeClass {
  static get invariant() {
    return staticInvariant;
  }
}

describe('invariant.staticInvariant', () => {
  afterEach(() => {
    invariant.mockClear();
  });

  it('should call invariant with provided condition result', () => {
    SomeClass.invariant(false, 'some message');

    expect(invariant.mock.calls).toHaveLength(1);
    expect(invariant.mock.calls[0][0]).toBe(false);
  });

  it('should provides constructor name in message', () => {
    class InheritedClass extends SomeClass {}

    InheritedClass.invariant(true, 'some message');

    expect(invariant.mock.calls).toHaveLength(1);
    expect(invariant).toBeCalledWith(true, '[InheritedClass] some message');
  });
});
