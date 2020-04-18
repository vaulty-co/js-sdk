import invariant from 'invariant';

import { createInvariant } from '../invariant';

jest.mock('invariant', () => jest.fn());

describe('invariant.createInvariant', () => {
  afterEach(() => {
    invariant.mockClear();
  });

  it('should create invariant with specified message prefix', () => {
    const inv = createInvariant('somePrefix');

    inv(false, 'message');

    expect(invariant.mock.calls).toHaveLength(1);
    expect(invariant).toBeCalledWith(false, '[somePrefix] message');
  });
});
