import invariant from 'invariant';
import { BroadcastChannel } from 'broadcast-channel';
import { SlaveChannel } from '@js-sdk/common/src/channels/SlaveChannel';
import { isSafari } from '@js-sdk/common/src/helpers/isSafari';

import { Config } from '../../config';

const CONTROLLER_STATUSES = {
  INIT: 'init',
  DESTROYED: 'destroyed',
};

/**
 * Controller base class
 * @class
 * @extends {ElementsInstance}
 */
class Controller {
  static get STATUSES() {
    return CONTROLLER_STATUSES;
  }

  /**
   * @param {boolean} condition
   * @param {string} message
   */
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  /**
   * @param {string} options.channelId
   * @param {string} options.sdkId
   */
  constructor(options) {
    this.status = CONTROLLER_STATUSES.INIT;
    this.channelId = options?.channelId;

    let broadcastChannelOptions = {};
    // Notice: Safari does not allow IndexDB fallback in iFrame and we should manually
    // use localStorage
    if (isSafari()) {
      broadcastChannelOptions = {
        type: 'localstorage',
      };
    }
    this.broadcastChannel = new BroadcastChannel(
      options?.sdkId,
      broadcastChannelOptions,
    );
  }

  /**
   * Mount controller
   */
  mount() {
    this.openChannel();
    this.registerHandlers();
  }

  /**
   * Unmount controller
   */
  unmount() {
    this.destroy();
  }

  /**
   * Open channel with master frame
   * @protected
   */
  openChannel() {
    this.constructor.invariant(
      Boolean(this.channelId),
      'Controller does not have specified "channelId" for opening channel',
    );

    this.controllerSlaveChannel = new SlaveChannel({
      channelId: this.channelId,
      targetOrigin: Config.sdkOrigin,
    });
    this.controllerSlaveChannel.connect();
  }

  /**
   * Register allowed messages by master frame and give response by this messages
   * @private
   */
  // eslint-disable-line class-methods-use-this
  registerHandlers() {

  }

  /**
   * Destroy controller
   */
  destroy() {
    if (this.status === CONTROLLER_STATUSES.DESTROYED) {
      this.constructor.invariant(
        false,
        'Controller is destroyed and can not be destroyed again.',
      );
      return;
    }

    this.controllerSlaveChannel.destroy();
    this.controllerSlaveChannel = null;

    this.broadcastChannel.close();
    this.broadcastChannel = null;
  }
}

export default Controller;
export {
  Controller,
};
