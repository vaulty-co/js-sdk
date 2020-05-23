import { MasterChannel } from '@js-sdk/common/src/channels/MasterChannel';
import { staticInvariant } from '@js-sdk/common/src/helpers/invariant';

import { configSelector } from '../config/selectors';

/**
 * Control fields' channels
 * @class
 */
class Channels {
  static get invariant() {
    return staticInvariant;
  }

  /**
   * @param {Store} store
   */
  constructor(store) {
    this.store = store;
    /**
     * @type {Object.<string, MasterChannel>}
     */
    this.channels = {};
  }

  /**
   * Register channel
   * @description
   * Create channel for specified iframe and register its
   * @param {string} channelId
   * @param {HTMLIFrameElement} iframeDomNode
   * @return {MasterChannel}
   */
  register({ channelId, iframeDomNode }) {
    this.unregister({ channelId });
    const config = configSelector(this.store.getState());
    this.channels[channelId] = new MasterChannel({
      channelId,
      target: iframeDomNode,
      targetOrigin: config.elementsOrigin,
    });
    return this.channels[channelId];
  }

  /**
   * Unregister channel
   * @description
   * Create channel for specified iframe and register its
   * @param {string} channelId
   * @return {boolean} - success of unregistering
   */
  unregister({ channelId }) {
    const channel = this.channels[channelId];
    if (channel) {
      channel.destroy();
      delete this.channels[channelId];
      return true;
    }
    return false;
  }

  /**
   * Connect channel with its iframe
   * @param {string} channelId
   * @return {?MasterChannel}
   */
  getChannel(channelId) {
    const channel = this.channels[channelId];
    this.constructor.invariant(
      Boolean(channel),
      `Does not find out channel with channelId: '${channelId}'. Probably, you forgot to register channel.`,
    );
    if (channel) {
      return channel;
    }
    return null;
  }
}

export default Channels;
export {
  Channels,
};
