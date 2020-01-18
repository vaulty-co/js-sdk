import invariant from 'invariant';
import { SlaveChannel } from '@js-sdk/utils/src/channels/SlaveChannel';
import { Message } from '@js-sdk/utils/src/channels/Message';

import { NODE_TYPES } from '../constants/nodeTypes';
import { Config } from '../../config';
import {
  IS_MOUNTED_REQUEST,
  IS_MOUNTED_RESPONSE,
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
   * @param {HTMLElement} options.node
   * @param {string} options.channelId
   */
  constructor(options) {
    const node = options?.node;
    this.constructor.invariant(
      typeof node === 'object' && node.nodeType === NODE_TYPES.ELEMENT_NODE,
      'Node for field should be a HTMLElement',
    );

    this.status = FIELD_STATUSES.INIT;
    this.node = node;
    this.channelId = options?.channelId;
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

    this.constructor.invariant(
      typeof parent === 'object' && parent.nodeType === NODE_TYPES.ELEMENT_NODE,
      'Parent node should be a HTMLElement node',
    );

    this.parent = parent;
    parent.appendChild(this.node);
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
    this.fieldSlaveChannel.subscribe(IS_MOUNTED_REQUEST, () => {
      this.fieldSlaveChannel.postMessage(
        new Message(IS_MOUNTED_RESPONSE, { success: true }),
      );
    });
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

    if (this.parent) {
      this.parent.removeChild(this.node);
    }
    this.status = FIELD_STATUSES.DESTROYED;
    this.node = null;
    this.parent = null;

    if (this.fieldSlaveChannel) {
      this.fieldSlaveChannel.destroy();
      this.fieldSlaveChannel = null;
    }
  }
}

export default Field;
export {
  Field,
};
