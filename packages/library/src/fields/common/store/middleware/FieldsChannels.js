import { MasterChannel } from '@js-sdk/common/src/channels/MasterChannel';
import { Config } from '@js-sdk/library/src/config';
import { staticInvariant } from '@js-sdk/common/src/helpers/invariant';

/**
 * Control fields' channels
 * @class
 */
class FieldsChannels {
  static get invariant() {
    return staticInvariant;
  }

  constructor() {
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
    this.channels[channelId] = new MasterChannel({
      channelId,
      target: iframeDomNode,
      targetOrigin: Config.elementsOrigin,
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

export default FieldsChannels;
export {
  FieldsChannels,
};
