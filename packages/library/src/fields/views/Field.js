import invariant from 'invariant';
import EventEmitter from 'events';
import { MasterChannel } from '@js-sdk/common/src/channels/MasterChannel';
import { Message } from '@js-sdk/common/src/channels/Message';
import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';
import {
  INITIALIZE_FIELD_REQUEST,
  INITIALIZE_FIELD_RESPONSE,
  FIELD_DATA_CHANGE_RESPONSE,
  FIELD_FOCUS_CHANGE,
  FIELD_LOADED,
  FOCUS_FIELD,
  BLUR_FIELD,
  CLEAR_FIELD,
} from '@js-sdk/elements/src/fields/common/Field/messages';

import { Config } from '../../config';
import { connectField } from '../utils/connectField';

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
    this.options = options;
    /**
     * @type {EventEmitter}
     */
    this.events = new EventEmitter();
  }

  /**
   * Append field in some DOM node
   * @param {string|HTMLElement} parentNode - valid css selector or DOM node, where element should be appended
   */
  appendTo(parentNode) {
    this.fieldIframe.appendTo(parentNode);

    this.openChannel();
    this.handleChanges();
    this.handleFocusChanges();
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
  focus() {
    this.fieldMasterChannel.postMessage(
      new Message(FOCUS_FIELD),
    );
  }

  /**
   * Blur field
   */
  blur() {
    this.fieldMasterChannel.postMessage(
      new Message(BLUR_FIELD),
    );
  }

  /**
   * Clear field value
   */
  clear() {
    this.fieldMasterChannel.postMessage(
      new Message(CLEAR_FIELD),
    );
  }

  /**
   * Destroy field and its DOM tree. It does not destroy parent, where field have been placed.
   * Field is not usable after destroy
   */
  destroy() {
    this.fieldIframe.destroy();
    this.fieldIframe = null;

    this.events.removeAllListeners();
  }

  /**
   * Connect to slave channel
   * @private
   */
  openChannel() {
    this.setFieldStatus({
      readiness: FieldModel.STATUSES.READINESS.LOADING,
    });

    this.fieldMasterChannel = new MasterChannel({
      channelId: this.id,
      target: this.fieldIframe.node,
      targetOrigin: Config.elementsOrigin,
    });
    this.fieldMasterChannel.subscribe(FIELD_LOADED, (message) => {
      if (message.payload.success) {
        // Reset field status, if it is reloaded
        this.setFieldStatus({
          ...FieldModel.STATUSES.INITIAL,
          node: FieldModel.STATUSES.NODE.MOUNTED,
        });
        this.requestInitialization();
      }
    });
    this.fieldMasterChannel.connect();
  }

  /**
   * Request initialization of field
   * @private
   */
  requestInitialization() {
    this.fieldMasterChannel.postMessage(
      new Message(INITIALIZE_FIELD_REQUEST, {
        id: this.id,
        field: this.field,
      }),
    );
    this.fieldMasterChannel.subscribe(INITIALIZE_FIELD_RESPONSE, (message) => {
      if (message.payload.success) {
        this.setFieldStatus({
          validation: {
            status: FieldModel.STATUSES.VALIDATION.VALID,
            invalidValidators: [],
          },
          readiness: FieldModel.STATUSES.READINESS.READY,
        });
      }
    });
  }

  /**
   * Handle field changes
   * @private
   */
  handleChanges() {
    this.fieldMasterChannel.subscribe(FIELD_DATA_CHANGE_RESPONSE, (message) => {
      const { isDirty, validation: { isValid, validators } = {} } = message.payload;
      this.setFieldStatus({
        content: (
          isDirty
            ? FieldModel.STATUSES.CONTENT.DIRTY
            : FieldModel.STATUSES.CONTENT.EMPTY
        ),
        validation: {
          status: (
            isValid
              ? FieldModel.STATUSES.VALIDATION.VALID
              : FieldModel.STATUSES.VALIDATION.INVALID
          ),
          invalidValidators: validators.filter((validator) => !validator.isValid),
        },
      });
    });
  }

  /**
   * Handle field focus
   * @private
   */
  handleFocusChanges() {
    this.fieldMasterChannel.subscribe(FIELD_FOCUS_CHANGE, (message) => {
      const { isFocused } = message.payload;
      this.setFieldStatus({
        focus: isFocused ? FieldModel.STATUSES.FOCUS.FOCUSED : FieldModel.STATUSES.FOCUS.UNFOCUSED,
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
