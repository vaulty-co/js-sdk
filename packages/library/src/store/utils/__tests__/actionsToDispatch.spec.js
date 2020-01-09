import { createAction } from 'redux-actions';

import { actionsToDispatch } from '../actionsToDispatch';

describe('actionsToDispatch', () => {
  let someAction;
  let otherAction;
  let dispatch;
  let store;

  beforeEach(() => {
    someAction = createAction('someAction');
    otherAction = createAction('otherAction');
    dispatch = jest.fn();
    store = {
      dispatch,
    };
  });

  it('should convert actions map to functions, which dispatch them in store', () => {
    const dispatchers = actionsToDispatch(store)({
      someAction,
      otherAction,
    });
    const data = {};

    dispatchers.someAction(data);

    expect(dispatch.mock.calls).toHaveLength(1);
    expect(dispatch).toBeCalledWith({ type: 'someAction', payload: data });
  });

  it('should provide all arguments in action creator', () => {
    otherAction = jest.fn();
    const dispatchers = actionsToDispatch(store)({
      someAction,
      otherAction,
    });
    const data = {};
    const meta = {};

    dispatchers.otherAction(data, meta);

    expect(otherAction).toBeCalledWith(data, meta);
  });
});
