import { Channel } from './Channel';
import {
  PING_MESSAGE_TYPE,
  PONG_MESSAGE_TYPE,
} from './constants';
import { Message } from './Message';

/**
 * @typedef {Object} SlaveChannelOptions
 * @property {string} channelId
 * @property {string} targetOrigin
 */

/**
 * Create slave channel, which can be connected to master outside of iframe by channel id
 * @class
 */
class SlaveChannel extends Channel {
  /**
   * @param {SlaveChannelOptions} options
   */
  constructor(options = {}) {
    super();

    /**
     * Channel identifier
     * @type {string}
     */
    this.channelId = options.channelId;
    /**
     * Connected iFrame origin
     * @type {string}
     */
    this.targetOrigin = options.targetOrigin;

    this.onConnectionMessageHandler = this.onConnectionMessageHandler.bind(this);
  }

  /**
   * Connect with target origin
   */
  connect() {
    window.addEventListener('message', this.onConnectionMessageHandler);
  }

  /**
   * Disconnect from target origin
   */
  disconnect() {
    window.removeEventListener('message', this.onConnectionMessageHandler);
    this.closePort();
  }

  /**
   * Destroy channel
   */
  destroy() {
    this.disconnect();

    super.destroy();
  }

  /**
   * Connection message handler
   * @param {MessageEvent} event
   * @private
   */
  onConnectionMessageHandler(event) {
    if (event.origin === this.targetOrigin) {
      const message = Message.of(event.data);
      if (message?.meta.channelId === this.channelId && message.type === PING_MESSAGE_TYPE) {
        window.removeEventListener('message', this.onConnectionMessageHandler);
        const port = event.ports[0];
        this.pong(port);
        this.openPort(port);
      }
    }
  }

  /**
   * Post pong message
   * @param {MessagePort} port
   * @private
   */
  pong(port) {
    const message = new Message(PONG_MESSAGE_TYPE);
    port.postMessage(`${message}`);
  }

  /**
   * Posting message with log
   * @param {Message} message
   * @protected
   */
  postingMessage(message) {
    console.log('[SlaveChannel]', 'channelId:', this.channelId, 'message:', message.type, 'payload:', message.payload);
    super.postingMessage(message);
  }
}

export default SlaveChannel;
export {
  SlaveChannel,
};
