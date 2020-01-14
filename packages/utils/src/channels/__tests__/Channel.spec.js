import { Channel } from '../Channel';
import { Message } from '../Message';

describe('Channel', () => {
  let port;
  let channel;

  beforeEach(() => {
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'removeEventListener');
    port = {
      close: jest.fn(),
      postMessage: jest.fn(),
      onmessage: null,
    };
    channel = new Channel();
  });

  afterEach(() => {
    channel.destroy();
  });

  describe('constructor', () => {
    it('should set status to INITIALIZED', () => {
      expect(channel.status).toBe(Channel.STATUSES.INITIALIZED);
    });

    it('should add listener to beforeunload window event', () => {
      expect(window.addEventListener).toBeCalledWith('beforeunload', channel.destroy);
    });
  });

  describe('#openPort', () => {
    it('should close previously opened port', () => {
      jest.spyOn(channel, 'closePort');

      channel.openPort(port);

      expect(channel.closePort).toBeCalled();
    });

    it('should setup port in channel', () => {
      channel.openPort(port);

      expect(channel.port).toBe(port);
    });

    it('should setup port in channel', () => {
      channel.openPort(port);

      expect(channel.port).toBe(port);
    });

    it('should subscribe to message on port', () => {
      const subscriptionHandler = jest.fn();
      const message = new Message('some_message');
      channel.openPort(port);
      channel.subscribe(message.type, subscriptionHandler);

      port.onmessage({ data: message.toString() });

      expect(subscriptionHandler).toBeCalledWith(message);
    });

    it('should change status to OPENED', () => {
      channel.openPort(port);

      expect(channel.status).toBe(Channel.STATUSES.OPENED);
    });

    it('should start executing queue added previously messages to posting in port', () => {
      const firstMessage = new Message('first_message');
      const secondMessage = new Message('second_message');
      channel.postMessage(firstMessage);
      channel.postMessage(secondMessage);

      expect(port.postMessage).not.toBeCalled();

      channel.openPort(port);

      expect(port.postMessage).toHaveBeenNthCalledWith(1, firstMessage.toString());
      expect(port.postMessage).toHaveBeenNthCalledWith(2, secondMessage.toString());
      expect(port.postMessage).toHaveBeenCalledTimes(2);
    });

    it('should not execute queue when previously nothing was been posted', () => {
      channel.openPort(port);

      expect(port.postMessage).not.toBeCalled();
    });
  });

  describe('#closePort', () => {
    beforeEach(() => {
      channel.openPort(port);
    });

    it('should not throw error, when port is not specified', () => {
      channel = new Channel();

      expect(() => {
        channel.closePort();
      }).not.toThrowError();
    });

    it('should call closing port', () => {
      channel.closePort();

      expect(port.close).toBeCalled();
    });

    it('should delete port handler', () => {
      expect(port.onmessage).toBeInstanceOf(Function);
      channel.closePort();

      expect(port.onmessage).toBe(null);
    });

    it('should delete port from channel', () => {
      channel.closePort();

      expect(channel.port).toBe(null);
    });

    it('should change channel status to CLOSED', () => {
      channel.closePort();

      expect(channel.status).toBe(Channel.STATUSES.CLOSED);
    });
  });

  describe('#postMessage', () => {
    let message;
    beforeEach(() => {
      message = new Message('some_message');
    });

    it('should place message in queue', () => {
      channel.postMessage(message);

      expect(channel.messagesQueue).toEqual([message]);
    });

    it('should not execute queue if port is not specified', () => {
      channel.postMessage(message);

      expect(port.postMessage).not.toBeCalled();
    });

    it('should start executing queue if port is specified', () => {
      channel.openPort(port);
      channel.postMessage(message);

      expect(port.postMessage).toHaveBeenNthCalledWith(1, message.toString());
      expect(port.postMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('#subscribe', () => {
    it('should subscribe to message type and just exact handler by this type', () => {
      const firstMessage = new Message('firstMessage');
      const secondMessage = new Message('secondMessage');
      const firstHandler = jest.fn();
      const secondHandler = jest.fn();
      channel.openPort(port);
      channel.subscribe(firstMessage.type, firstHandler);
      channel.subscribe(secondMessage.type, secondHandler);

      port.onmessage({ data: firstMessage.toString() });

      expect(firstHandler).toBeCalled();
      expect(secondHandler).not.toBeCalled();
    });
  });

  describe('#unsubscribe', () => {
    it('should unsubscribe handler by message type', () => {
      const message = new Message('firstMessage');
      const handler = jest.fn();
      channel.openPort(port);
      channel.subscribe(message.type, handler);

      channel.unsubscribe(message.type, handler);
      port.onmessage({ data: message.toString() });

      expect(handler).not.toBeCalled();
    });
  });

  describe('#destroy', () => {
    it('should remove event listener to beforeunload window event', () => {
      channel.destroy();

      expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', channel.destroy);
    });

    it('should change status to DESTROYED', () => {
      channel.destroy();

      expect(channel.status).toBe(Channel.STATUSES.DESTROYED);
    });

    it('should close channel port', () => {
      jest.spyOn(channel, 'closePort');
      channel.destroy();

      expect(channel.closePort).toBeCalled();
    });

    it('should clear message queue', () => {
      channel.postMessage(new Message('some_message'));
      channel.destroy();

      expect(channel.messagesQueue).toEqual([]);
    });

    it('should not throw errors, when channel is destroyed twice and more', () => {
      channel.destroy();

      expect(() => {
        channel.destroy();
      }).not.toThrowError();
    });
  });
});
