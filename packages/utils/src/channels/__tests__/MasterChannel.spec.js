import { MasterChannel } from '../MasterChannel';
import { Message } from '../Message';
import { PING_MESSAGE_TYPE, PONG_MESSAGE_TYPE } from '../constants';
import { createMessageChannel } from '../utils';

jest.useFakeTimers();

jest.mock('../utils', () => {
  const messageChannel = {
    port1: { close: jest.fn(), onmessage: null, postMessage: jest.fn() },
    port2: { close: jest.fn(), onmessage: null, postMessage: jest.fn() },
  };
  return ({
    ...jest.requireActual('../utils'),
    createMessageChannel() {
      return messageChannel;
    },
  });
});

describe('MasterChannel', () => {
  const pingMessage = new Message(
    PING_MESSAGE_TYPE,
    {},
    { channelId: 'some-channel-id' },
  );
  const pongMessage = new Message(
    PONG_MESSAGE_TYPE,
    {},
    { channelId: 'some-channel-id' },
  );
  let masterChannel;
  let target;
  let targetOrigin;

  beforeEach(() => {
    targetOrigin = '*';
    target = document.createElement('iframe');
    target.src = '#';
    document.body.appendChild(target);
    masterChannel = new MasterChannel({
      channelId: 'some-channel-id',
      target,
      targetOrigin,
    });
    jest.spyOn(masterChannel.target.contentWindow, 'postMessage');
  });

  afterEach(() => {
    masterChannel.destroy();
    createMessageChannel().port1.postMessage.mockClear();
    createMessageChannel().port1.close.mockClear();
    createMessageChannel().port2.postMessage.mockClear();
    createMessageChannel().port2.close.mockClear();
    document.body.removeChild(target);
  });

  describe('#connect', () => {
    it('should wait when iframe is loading', () => {
      masterChannel.onTargetLoad = jest.fn();
      masterChannel.connect();

      target.dispatchEvent(new Event('load'));

      expect(masterChannel.onTargetLoad).toBeCalled();
    });

    it('should start PING iframe, when it is loaded', () => {
      const { port2 } = createMessageChannel();
      masterChannel.connect();

      target.dispatchEvent(new Event('load'));

      expect(masterChannel.target.contentWindow.postMessage)
        .toHaveBeenCalledWith(`${pingMessage}`, targetOrigin, [port2]);
    });

    it('should stop PING, when iframe answer PONG', () => {
      const { port1, port2 } = createMessageChannel();
      masterChannel.connect();

      target.dispatchEvent(new Event('load'));

      expect(masterChannel.target.contentWindow.postMessage)
        .toHaveBeenCalledWith(`${pingMessage}`, targetOrigin, [port2]);

      jest.runOnlyPendingTimers();

      expect(masterChannel.target.contentWindow.postMessage)
        .toHaveBeenCalledWith(`${pingMessage}`, targetOrigin, [port2]);

      port1.onmessage({ data: pongMessage.toString() });
      jest.runOnlyPendingTimers();

      expect(masterChannel.target.contentWindow.postMessage).toHaveBeenCalledTimes(2);
    });

    it('should setup port when connection is established', () => {
      const { port1, port2 } = createMessageChannel();
      masterChannel.connect();

      target.dispatchEvent(new Event('load'));

      expect(masterChannel.target.contentWindow.postMessage)
        .toHaveBeenCalledWith(`${pingMessage}`, targetOrigin, [port2]);

      port1.onmessage({ data: pongMessage.toString() });
      jest.runOnlyPendingTimers();

      expect(masterChannel.port).toBe(port1);
    });
  });

  describe('#disconnect', () => {
    it('should stop waiting, when iframe is completed', () => {
      masterChannel.onTargetLoad = jest.fn();
      masterChannel.connect();

      masterChannel.disconnect();
      target.dispatchEvent(new Event('load'));

      expect(masterChannel.onTargetLoad).not.toBeCalled();
    });

    it('should stop waiting PONG, when iframe was loaded', () => {
      masterChannel.connect();
      target.dispatchEvent(new Event('load'));

      jest.runOnlyPendingTimers();
      masterChannel.disconnect();
      jest.runOnlyPendingTimers();

      expect(masterChannel.target.contentWindow.postMessage).toHaveBeenCalledTimes(2);
    });

    it('should close port', () => {
      masterChannel.connect();
      jest.spyOn(masterChannel, 'closePort');

      masterChannel.disconnect();

      expect(masterChannel.closePort).toBeCalled();
    });
  });
});
