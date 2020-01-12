import EventEmitter from 'events';

import { CHANNEL_STATUSES } from './constants';
import { createMessagePortHandler } from './utils';

/**
 * @class
 */
class Channel {
  constructor() {
    /**
     * Connection port
     * @type {?MessagePort}
     */
    this.port = null;
    /**
     * Queue of messages
     * @type {Array}
     */
    this.messagesQueue = [];
    /**
     * @type {EventEmitter}
     */
    this.events = new EventEmitter();
    /**
     * @enum {CHANNEL_STATUSES}
     */
    this.status = CHANNEL_STATUSES.INITIALIZED;

    window.addEventListener('beforeunload', () => {
      this.destroy();
    });
  }

  /**
   * Open channel by MessagePort and execute waiting messages
   * @param {MessagePort} port
   */
  openPort(port) {
    this.closePort();

    this.port = port;
    this.port.onmessage = createMessagePortHandler((message) => {
      this.events.emit(message.type, message);
      this.executeQueue();
    });
    this.status = CHANNEL_STATUSES.OPENED;
    this.executeQueue();
  }

  /**
   * Close port, which is used for channel
   */
  closePort() {
    if (this.port) {
      this.status = CHANNEL_STATUSES.CLOSED;
      this.port.close();
      this.port.onmessage = null;
      this.port = null;
    }
  }

  /**
   * Post message in channel
   * @param {Message} message
   */
  postMessage(message) {
    this.messagesQueue.push(message);
    this.executeQueue();
  }

  /**
   * Subscribe to message by message type
   * @param {string} messageType
   * @param {function(message:Message)} handler
   */
  subscribe(messageType, handler) {
    this.events.on(messageType, handler);
  }

  /**
   * Subscribe from message by message type
   * @param {string} messageType
   * @param {function(message:Message)} handler
   */
  unsubscribe(messageType, handler) {
    this.events.off(messageType, handler);
  }

  /**
   * Destroy channel
   */
  destroy() {
    this.status = CHANNEL_STATUSES.DESTROYED;
    this.events.removeAllListeners();
    this.events = null;

    this.closePort();

    this.messagesQueue = [];
  }

  /**
   * Execute queue of messages, when port exists
   * @protected
   */
  executeQueue() {
    if (this.messagesQueue.length === 0 || this.status !== CHANNEL_STATUSES.OPENED) {
      return;
    }

    this.status = CHANNEL_STATUSES.EXECUTING;
    const message = this.messagesQueue.shift();
    this.postingMessage(message);
  }

  /**
   * @param {Message} message
   * @protected
   */
  postingMessage(message) {
    this.port.postMessage(`${message}`);
    this.status = CHANNEL_STATUSES.OPENED;
    this.executeQueue();
  }
}

export default Channel;
export {
  Channel,
};
