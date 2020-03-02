import invariant from 'invariant';
import { BroadcastChannel } from 'broadcast-channel';
import { SlaveChannel } from '@js-sdk/utils/src/channels/SlaveChannel';
import { Message } from '@js-sdk/utils/src/channels/Message';
import { isSafari } from '@js-sdk/utils/src/helpers/isSafari';
import { Node } from '@js-sdk/utils/src/nodes/Node';
import { ComposedValidator } from '@js-sdk/utils/src/validators/ComposedValidator';

import { Config } from '../../../config';
import { VALIDATORS_TYPES } from '../../../validators/constants';
import { VALIDATORS_REGISTRY } from '../../../validators/registry';
import {
  FIELD_LOADED,
  INITIALIZE_FIELD_REQUEST,
  INITIALIZE_FIELD_RESPONSE,
  FIELD_DATA_CHANGE_RESPONSE,
  FIELD_FOCUS_CHANGE,
  FOCUS_FIELD,
  BLUR_FIELD,
  CLEAR_FIELD,
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
   * @param {FieldOptions} options
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
    this.composedValidator = new ComposedValidator();

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
   * Focus field
   */
  focusField() {
    this.fieldNode.focus();
  }

  /**
   * Blur field
   */
  blurField() {
    this.fieldNode.blur();
  }

  /**
   * Clear field
   */
  clearField() {
    this.fieldNode.clear();
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
    this.fieldSlaveChannel.postMessage(
      new Message(FIELD_LOADED, {
        success: true,
      }),
    );
  }

  /**
   * Register allowed messages by master frame and give response by this messages
   * @private
   */
  registerHandlers() {
    this.fieldSlaveChannel.subscribe(INITIALIZE_FIELD_REQUEST, (message) => {
      const {
        payload: {
          id, name, style = {}, validators = [],
        },
      } = message;
      this.id = id;
      this.name = name;
      this.composedValidator = this.createValidators(validators);
      this.fieldNode.setStyle(style);
      this.fieldSlaveChannel.postMessage(
        new Message(INITIALIZE_FIELD_RESPONSE, { success: true }),
      );
    });
    this.fieldSlaveChannel.subscribe(FOCUS_FIELD, () => {
      this.focusField();
    });
    this.fieldSlaveChannel.subscribe(BLUR_FIELD, () => {
      this.blurField();
    });
    this.fieldSlaveChannel.subscribe(CLEAR_FIELD, () => {
      this.clearField();
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
   * Send field focus
   * @param {FieldFocusChangePayload} payload
   * @protected
   */
  sendFocusChanges(payload) {
    this.fieldSlaveChannel.postMessage(
      new Message(
        FIELD_FOCUS_CHANGE,
        payload,
      ),
    );
  }

  /**
   * Create validators by provided from library user validators types
   * @param {Array<string>} providedValidators
   * @returns {ComposedValidator}
   * @private
   */
  createValidators(providedValidators = []) {
    const validatorsTypesSetup = Object
      .keys(VALIDATORS_TYPES)
      .map((key) => VALIDATORS_TYPES[key])
      .filter((validatorType) => providedValidators.includes(validatorType));
    const validators = validatorsTypesSetup.map((validatorType) => {
      const Validator = VALIDATORS_REGISTRY[validatorType];
      this.constructor.invariant(
        Boolean(Validator),
        `Does not found out validator: '${validatorType}'`,
      );
      return new Validator();
    });

    return new ComposedValidator(validators);
  }
}

export default Field;
export {
  Field,
};
