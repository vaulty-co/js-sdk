import { SlaveChannel } from '@vaulty/common/src/channels/SlaveChannel';
import { createBroadcastChannel } from '@vaulty/common/src/channels/utils';
import { staticInvariant } from '@vaulty/common/src/helpers/invariant';
import { Message } from '@vaulty/common/src/channels/Message';

import { Config } from '../../../config';
import {
  PUT_CONTROLLER_REQUEST,
  ADD_FIELDS_IDS_TO_CONTROLLER_REQUEST,
  REMOVE_FIELDS_IDS_FROM_CONTROLLER_REQUEST,
  PATCH_CONTROLLER_STATUS_REQUEST,
  CONTROLLER_LOADED_WATCHER,
} from './messages';
import { putControllerHandler } from './handlers/putController';
import { addFieldsIdsHandler } from './handlers/addFields';
import { removeFieldsIdsHandler } from './handlers/removeFields';
import { patchStatusHandler } from './handlers/patchStatus';

const CONTROLLER_STATUSES = {
  INIT: 'init',
  DESTROYED: 'destroyed',
};

/**
 * Controller base class
 * @class ControllerElement
 * @extends ElementsInstance
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
    /**
     * @type {?ControllerModel}
     */
    this.controllerModel = null;
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
    this.controllerSlaveChannel.postMessage(
      new Message(CONTROLLER_LOADED_WATCHER),
    );
  }

  /**
   * Register allowed messages by master frame and give response by this messages
   * @protected
   */
  registerHandlers() {
    this.controllerSlaveChannel.subscribe(
      PUT_CONTROLLER_REQUEST,
      putControllerHandler.bind(this),
    );
    this.controllerSlaveChannel.subscribe(
      ADD_FIELDS_IDS_TO_CONTROLLER_REQUEST,
      addFieldsIdsHandler.bind(this),
    );
    this.controllerSlaveChannel.subscribe(
      REMOVE_FIELDS_IDS_FROM_CONTROLLER_REQUEST,
      removeFieldsIdsHandler.bind(this),
    );
    this.controllerSlaveChannel.subscribe(
      PATCH_CONTROLLER_STATUS_REQUEST,
      patchStatusHandler.bind(this),
    );
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

    this.controllerModel = null;
  }
}

export default Controller;
export {
  Controller,
};
