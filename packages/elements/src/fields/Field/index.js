import invariant from 'invariant';
import { BroadcastChannel } from 'broadcast-channel';
import { SlaveChannel } from '@js-sdk/utils/src/channels/SlaveChannel';
import { Message } from '@js-sdk/utils/src/channels/Message';
import { isSafari } from '@js-sdk/utils/src/helpers/isSafari';
import { Node } from '@js-sdk/utils/src/nodes/Node';

import { Config } from '../../config';
import {
  FIELD_DATA_CHANGE_RESPONSE,
  INITIALIZE_REQUEST,
  INITIALIZE_RESPONSE,
} from './messages';

const FIELD_STATUSES = {
  INIT: 'init',
  DESTROYED: 'destroyed',
};

/**
 * Base class for Field
 * @class
 * @extends {ElementsInstance}
 */
class Field {
  /**
   * @param {boolean} condition
   * @param {string} message
   */
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  static get STATUSES() {
    return FIELD_STATUSES;
  }

  /**
   * @param {Node} options.node
   * @param {string} options.channelId
   * @param {string} options.sdkId
   */
  constructor(options) {
    const node = options?.node;
    this.constructor.invariant(
      typeof node === 'object' && node instanceof Node,
      'Field\'s node should be instance of Node',
    );

    this.status = FIELD_STATUSES.INIT;
    this.fieldNode = node;
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
   * Mount field
   * @param {HTMLElement} node
   */
  mount(node) {
    this.appendTo(node);
    this.openChannel();
    this.registerHandlers();
  }

  /**
   * Unmount field
   */
  unmount() {
    this.destroy();
  }

  /**
   * Append field node to parent node
   * @param {HTMLElement} parent - parent node
   */
  appendTo(parent) {
    if (this.status === FIELD_STATUSES.DESTROYED) {
      this.constructor.invariant(
        false,
        'Field is destroyed and can not be append to a parent node.',
      );
      return;
    }

    this.fieldNode.appendTo(parent);
  }

  /**
   * Open channel with master frame
   * @private
   */
  openChannel() {
    this.constructor.invariant(
      Boolean(this.channelId),
      'Field does not have specified "channelId" for opening channel',
    );

    this.fieldSlaveChannel = new SlaveChannel({
      channelId: this.channelId,
      targetOrigin: Config.sdkOrigin,
    });
    this.fieldSlaveChannel.connect();
  }

  /**
   * Register allowed messages by master frame and give response by this messages
   * @private
   */
  registerHandlers() {
    this.fieldSlaveChannel.subscribe(INITIALIZE_REQUEST, (message) => {
      const { payload: { id, name, style = {} } } = message;
      this.id = id;
      this.name = name;
      this.fieldNode.setStyle(style);
      this.fieldSlaveChannel.postMessage(
        new Message(INITIALIZE_RESPONSE, { success: true }),
      );
    });
  }

  /**
   * Send field data changes
   * @param {FieldDataChangePayload} payload
   * @protected
   */
  sendDataChanges(payload) {
    this.fieldSlaveChannel.postMessage(
      new Message(
        FIELD_DATA_CHANGE_RESPONSE,
        payload,
      ),
    );
  }

  /**
   * Destroy field and remove its from parent, if it is specified
   */
  destroy() {
    if (this.status === FIELD_STATUSES.DESTROYED) {
      this.constructor.invariant(
        false,
        'Field is destroyed and can not be destroyed again.',
      );
      return;
    }

    this.status = FIELD_STATUSES.DESTROYED;

    this.fieldNode.destroy();
    this.fieldNode = null;

    if (this.fieldSlaveChannel) {
      this.fieldSlaveChannel.destroy();
      this.fieldSlaveChannel = null;
    }

    this.broadcastChannel.close();
    this.broadcastChannel = null;
  }
}

export default Field;
export {
  Field,
};
