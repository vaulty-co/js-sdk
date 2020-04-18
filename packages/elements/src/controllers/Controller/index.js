import { SlaveChannel } from '@js-sdk/common/src/channels/SlaveChannel';
import { createBroadcastChannel } from '@js-sdk/common/src/channels/utils';
import { staticInvariant } from '@js-sdk/common/src/helpers/invariant';

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

  static get invariant() {
    return staticInvariant;
  }

  /**
   * @param {string} options.channelId
   * @param {string} options.sdkId
   */
  constructor(options) {
    this.status = CONTROLLER_STATUSES.INIT;
    this.channelId = options?.channelId;
    this.broadcastChannel = createBroadcastChannel(options?.sdkId);
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
