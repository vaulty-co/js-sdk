// FIXME - disabling eslint should be removed after creating behavior for methods
/* eslint-disable class-methods-use-this */
import invariant from 'invariant';
import EventEmitter from 'events';
import { MasterChannel } from '@js-sdk/utils/src/channels/MasterChannel';
import { Message } from '@js-sdk/utils/src/channels/Message';
import {
  FIELD_DATA_CHANGE_RESPONSE,
  INITIALIZE_REQUEST,
  INITIALIZE_RESPONSE,
} from '@js-sdk/elements/src/fields/Field/messages';

import { NODE_TYPES } from '../../constants/nodeTypes';
import { Config } from '../../config';
import { connectField } from '../utils/connectField';
import {
  DEFAULT_FIELD_STYLES,
  ALLOWED_STYLED_PROPS,
  FIELD_CONTENT_STATUSES,
  FIELD_VALIDATION_STATUSES,
  FIELD_READINESS_STATUSES,
} from '../constants';
import { filterStyles } from '../../helpers/filterStyles';

/**
 * @typedef {Object} FieldOptions
 * @property {string} name - field name. It is used for sending data from field in Form.
 * @property {FieldStyles} [style = {}] - field styles
 */

/**
 * @class
 */
class Field {
  /**
   * @param {boolean} condition
   * @param {string} message
   */
  static invariant(condition, message) {
    invariant(condition, `[${this.name}] ${message}`);
  }

  /**
   * @param {FieldOptions} options
   */
  constructor(options = {}) {
    const {
      name,
      style = {},
    } = options;

    /**
     * @type {string}
     */
    this.name = name;
    /**
     * Styles for field
     * @type {FieldStyles}
     */
    this.style = {
      ...DEFAULT_FIELD_STYLES,
      ...filterStyles(style, ALLOWED_STYLED_PROPS),
    };
    /**
     * @type {EventEmitter}
     */
    this.events = new EventEmitter();
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
    this.requestInitialization();
    this.handleChanges();
  }

  /**
   * Get field status
   * @returns {FieldStatus}
   */
  getStatus() {
    return this.field.status;
  }

  /**
   * Add handler to event
   * @param {string} eventName
   * @param {Function} eventHandler
   * @return {*}
   */
  on(eventName, eventHandler) {
    return this.events.on(eventName, eventHandler);
  }

  /**
   * Remove handler from event
   * @param {string} eventName
   * @param {Function} eventHandler
   * @return {*}
   */
  off(eventName, eventHandler) {
    return this.events.off(eventName, eventHandler);
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

    this.events.removeAllListeners();
  }

  /**
   * Connect to slave channel
   * @private
   */
  openChannel() {
    this.setFieldStatus({
      readiness: FIELD_READINESS_STATUSES.LOADING,
    });

    this.fieldMasterChannel = new MasterChannel({
      channelId: this.id,
      target: this.fieldIframe.node,
      targetOrigin: Config.elementsOrigin,
    });
    this.fieldMasterChannel.connect();
  }

  /**
   * Check mounted status
   * @private
   */
  requestInitialization() {
    this.fieldMasterChannel.postMessage(
      new Message(INITIALIZE_REQUEST, {
        id: this.id,
        name: this.name,
        style: this.style,
      }),
    );
    this.fieldMasterChannel.subscribe(INITIALIZE_RESPONSE, (message) => {
      if (message.payload.success) {
        this.setFieldStatus({
          validation: FIELD_VALIDATION_STATUSES.VALID,
          readiness: FIELD_READINESS_STATUSES.READY,
        });
      }
    });
  }

  /**
   * Handle field changes
   */
  handleChanges() {
    this.fieldMasterChannel.subscribe(FIELD_DATA_CHANGE_RESPONSE, (message) => {
      const { isDirty, isValid } = message.payload;
      this.setFieldStatus({
        content: isDirty ? FIELD_CONTENT_STATUSES.DIRTY : FIELD_CONTENT_STATUSES.EMPTY,
        validation: isValid ? FIELD_VALIDATION_STATUSES.VALID : FIELD_VALIDATION_STATUSES.INVALID,
      });
    });
  }
}

const ConnectedField = connectField(Field);

export default Field;
export {
  Field,
  ConnectedField,
};
