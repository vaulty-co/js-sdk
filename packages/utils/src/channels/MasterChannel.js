import { Channel } from './Channel';
import {
  DOCUMENT_READY_STATES,
  PING_MESSAGE_TYPE,
  PONG_MESSAGE_TYPE,
} from './constants';
import {
  createMessageChannel,
  createMessagePortHandler,
} from './utils';
import { Message } from './Message';

/**
 * @typedef {Object} MasterChannelOptions
 * @property {string} channelId
 * @property {HTMLIFrameElement} target
 * @property {string} targetOrigin
 */

/**
 * Create master channel, which opens communication with iFrame
 * @class
 */
class MasterChannel extends Channel {
  /**
   * @param {MasterChannelOptions} [options = {}]
   */
  constructor(options = {}) {
    super();

    /**
     * Channel identifier
     * @type {string}
     */
    this.channelId = options.channelId;
    /**
     * Connected iFrame instance
     * @type {HTMLIFrameElement}
     */
    this.target = options.target;
    /**
     * Connected iFrame origin
     * @type {string}
     */
    this.targetOrigin = options.targetOrigin;
    /**
     * @type {Function}
     */
    this.onTargetLoad = this.onTargetLoad.bind(this);
  }

  /**
   * Connect with target iFrame
   */
  connect() {
    if (this.target.readyState === DOCUMENT_READY_STATES.COMPLETE) {
      this.ping();
    } else {
      this.target.addEventListener('load', this.onTargetLoad);
    }
  }

  /**
   * Disconnect from target iFrame
   */
  disconnect() {
    clearTimeout(this.pingTimeout);
    this.target.removeEventListener('load', this.onTargetLoad);
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
   * On target loaded event handler
   * @private
   */
  onTargetLoad() {
    this.target.removeEventListener('load', this.onTargetLoad);
    this.ping();
  }

  /**
   * Trying to connect to target window
   * @private
   */
  ping() {
    /**
     * @type {number}
     * @private
     */
    this.pingTimeout = setTimeout(() => this.ping(), 100);

    const messageChannel = createMessageChannel();
    const pingMessage = new Message(PING_MESSAGE_TYPE, {}, { channelId: this.channelId });
    const {
      /** @type {MessagePort} */port1,
      /** @type {MessagePort} */port2,
    } = messageChannel;
    port1.onmessage = createMessagePortHandler((message) => {
      if (message.type === PONG_MESSAGE_TYPE) {
        clearTimeout(this.pingTimeout);
        this.openPort(port1);
      }
    });
    this.target.contentWindow.postMessage(`${pingMessage}`, this.targetOrigin, [port2]);
  }
}

export default MasterChannel;
export {
  MasterChannel,
};
