import { SlaveChannel } from '../SlaveChannel';
import { Message } from '../Message';
import { PING_MESSAGE_TYPE, PONG_MESSAGE_TYPE } from '../constants';

const createEvent = (eventType, data) => (
  Object.assign(
    new Event(eventType),
    data,
  )
);

describe('SlaveChannel', () => {
  const pingMessage = new Message(
    PING_MESSAGE_TYPE,
    {},
    { channelId: 'some-channel-id' },
  );
  const pongMessage = new Message(PONG_MESSAGE_TYPE);
  const port = { close: jest.fn(), onmessage, postMessage: jest.fn() };
  let slaveChannel;
  let targetOrigin;
  let successEvent;

  beforeEach(() => {
    targetOrigin = 'some-target-origin';
    slaveChannel = new SlaveChannel({
      channelId: 'some-channel-id',
      targetOrigin,
    });
    successEvent = createEvent(
      'message',
      {
        data: pingMessage.toString(),
        origin: targetOrigin,
        ports: [port],
      },
    );
    jest.spyOn(slaveChannel, 'openPort');
  });

  afterEach(() => {
    slaveChannel.destroy();
    port.postMessage.mockClear();
    port.close.mockClear();
  });

  describe('#connect', () => {
    it('should not open port, when message has not allowed origin', () => {
      const event = createEvent('message', { data: {}, origin: 'other-origin' });

      slaveChannel.connect();
      window.dispatchEvent(event);

      expect(slaveChannel.openPort).not.toBeCalled();
    });

    it('should not open port, when message has different channelId', () => {
      const otherPingMessage = new Message(
        PING_MESSAGE_TYPE,
        {},
        { channelId: 'other-channel-id' },
      );
      const event = createEvent(
        'message',
        {
          data: otherPingMessage.toString(),
          origin: targetOrigin,
        },
      );

      slaveChannel.connect();
      window.dispatchEvent(event);

      expect(slaveChannel.openPort).not.toBeCalled();
    });

    it('should not open port, when message is not PING', () => {
      const notPingMessage = new Message('notPingMessage');
      const event = createEvent(
        'message',
        {
          data: notPingMessage.toString(),
          origin: targetOrigin,
        },
      );

      slaveChannel.connect();
      window.dispatchEvent(event);

      expect(slaveChannel.openPort).not.toBeCalled();
    });

    it('should open port for PING message with allowed origin and channelId', () => {
      slaveChannel.connect();
      window.dispatchEvent(successEvent);

      expect(slaveChannel.openPort).toHaveBeenCalledWith(port);
    });

    it('should send PONG message as clarification, that connection is established', () => {
      slaveChannel.connect();
      window.dispatchEvent(successEvent);

      expect(port.postMessage).toHaveBeenCalledWith(pongMessage.toString());
    });

    it('should disconnect from window message event', () => {
      slaveChannel.connect();
      window.dispatchEvent(successEvent);
      window.dispatchEvent(successEvent);

      expect(port.postMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('#disconnect', () => {
    it('should switch off waiting a message', () => {
      slaveChannel.connect();

      slaveChannel.disconnect();
      window.dispatchEvent(successEvent);

      expect(port.postMessage).not.toBeCalled();
    });

    it('should close port', () => {
      slaveChannel.connect();
      window.dispatchEvent(successEvent);

      slaveChannel.disconnect();

      expect(port.close).toBeCalled();
    });
  });
});
