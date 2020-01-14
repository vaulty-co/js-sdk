import { createMessagePortHandler } from '../utils';
import { Message } from '../Message';

describe('utils.createMessagePortHandler', () => {
  it('should creates message port handler which works with MessageEvent', () => {
    const handler = createMessagePortHandler(Function.prototype);

    expect(handler).toBeInstanceOf(Function);
  });

  it('should transfer message in callback, when event contains message like data', () => {
    const message = new Message('some_message');
    const callback = jest.fn();
    const handler = createMessagePortHandler(callback);
    const messageEvent = { data: message.toString() };

    handler(messageEvent);

    expect(callback).toBeCalledWith(message, messageEvent);
  });

  it('should not call callback, if data is not message like', () => {
    const callback = jest.fn();
    const handler = createMessagePortHandler(callback);
    const messageEvent = { data: 'some other data' };

    handler(messageEvent);

    expect(callback).not.toBeCalled();
  });
});
