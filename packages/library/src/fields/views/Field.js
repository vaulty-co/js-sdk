// FIXME - disabling eslint should be removed after creating behavior for methods
/* eslint-disable class-methods-use-this */
import invariant from 'invariant';
import { MasterChannel } from '@js-sdk/utils/src/channels/MasterChannel';
import { Message } from '@js-sdk/utils/src/channels/Message';
import {
  IS_MOUNTED_REQUEST,
  IS_MOUNTED_RESPONSE,
} from '@js-sdk/elements/src/fields/Field/messages';

import { NODE_TYPES } from '../../constants/nodeTypes';
import { Config } from '../../config';
import { FieldModel } from '../models/FieldModel';
import { connectField } from '../utils/connectField';
import { uniqueId } from '../../helpers/uniqueId';

/**
 * @typedef {Object} FieldOptions
 * @property {string} name - field name. It is used for sending data from field in Form.
 */

/**
 * @class
 */
class Field {
  /**
   * @param {FieldOptions} options
   */
  constructor(options) {
    this.name = options?.name;
    this.channelId = uniqueId('channel-for-field-');
  }

  /**
   * @param {boolean} condition
   * @param {string} message
   */
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  /**
   * Append field in some DOM node
   * @param {string|HTMLElement} node - valid css selector or DOM node, where element should be appended
   */
  appendTo(node) {
    // TODO - it should be some util
    let resultNode = node;
    if (typeof node === 'string') {
      resultNode = document.querySelector(node);
    }
    this.parent = node;
    this.constructor.invariant(
      this.fieldIframe,
      'Field should contains "fieldIframe" property for manipulating its',
    );
    this.constructor.invariant(
      typeof resultNode === 'object'
      // TODO - NODE_TYPE should be placed in utils
      && resultNode.nodeType === NODE_TYPES.ELEMENT_NODE,
      'Field should be "appendTo" HTMLElement',
    );
    this.fieldIframe.appendTo(this.parent);

    this.openChannel();
    this.requestIsMounted();
  }

  /**
   * Connect to slave channel
   */
  openChannel() {
    this.dispatchers.setFieldStatus({ fieldId: this.id, status: FieldModel.STATUSES.LOADING });

    this.fieldMasterChannel = new MasterChannel({
      channelId: this.channelId,
      target: this.fieldIframe.node,
      targetOrigin: Config.elementsOrigin,
    });
    this.fieldMasterChannel.connect();
  }

  /**
   * Check mounted status
   */
  requestIsMounted() {
    this.fieldMasterChannel.postMessage(
      new Message(IS_MOUNTED_REQUEST, {
        fieldId: this.id,
      }),
    );
    this.fieldMasterChannel.subscribe(IS_MOUNTED_RESPONSE, (message) => {
      if (message.payload.success) {
        this.dispatchers.setFieldStatus({ fieldId: this.id, status: FieldModel.STATUSES.READY });
      }
    });
  }

  /**
   * Focus field
   */
  focus() {}

  /**
   * Blur field
   */
  blur() {}

  /**
   * Clear field value
   */
  clear() {}

  /**
   * Destroy field and its DOM tree. It does not destroy parent, where field have been placed.
   * Field is not usable after destroy
   */
  destroy() {
    this.fieldIframe.destroy();

    this.parent = null;
    this.fieldIframe = null;
  }
}

const ConnectedField = connectField(Field);

export default Field;
export {
  Field,
  ConnectedField,
};
