import invariant from 'invariant';
import { SlaveChannel } from '@js-sdk/common/src/channels/SlaveChannel';
import { Message } from '@js-sdk/common/src/channels/Message';
import { createBroadcastChannel } from '@js-sdk/common/src/channels/utils';
import { Node } from '@js-sdk/common/src/nodes/Node';
import { ComposedValidator } from '@js-sdk/common/src/validators/ComposedValidator';
import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';

import { Config } from '../../../config';
import { VALIDATORS_TYPES } from '../../../validators/constants';
import { VALIDATORS_REGISTRY } from '../../../validators/registry';
import {
  FIELD_LOADED,
  PUT_FIELD_REQUEST,
  PUT_FIELD_RESPONSE,
  PATCH_FIELD_SETTINGS_REQUEST,
  PATCH_FIELD_STATUS_RESPONSE,
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
    /**
     * @type {?FieldModel}
     */
    this.fieldModel = null;
    this.fieldNode = node;
    this.channelId = options?.channelId;
    this.composedValidator = new ComposedValidator();
    this.broadcastChannel = createBroadcastChannel(options?.sdkId);
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
   * Validate field value
   */
  validate() {
    const value = this.fieldNode.getValue();
    const isDirty = Boolean(value);
    const { isValid, validators } = this.composedValidator.validate(value);

    this.fieldModel.setStatus({
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
        invalidValidators: validators.filter(
          (validator) => !validator.isValid,
        ),
      },
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
    this.fieldSlaveChannel.subscribe(PUT_FIELD_REQUEST, (message) => {
      const {
        payload: {
          field: fieldModelJson,
        },
      } = message;

      // Prepare model
      this.fieldModel = FieldModel.of(fieldModelJson);
      this.fieldModel.setStatus({
        validation: {
          status: FieldModel.STATUSES.VALIDATION.VALID,
          invalidValidators: [],
        },
        readiness: FieldModel.STATUSES.READINESS.READY,
      });

      this.updateByModel({ silentValidation: true });

      // Send request back about successfully of operation
      this.fieldSlaveChannel.postMessage(
        new Message(PUT_FIELD_RESPONSE, {
          success: true,
          data: {
            fieldStatusPatch: this.fieldModel.status,
          },
        }),
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
    this.fieldSlaveChannel.subscribe(PATCH_FIELD_SETTINGS_REQUEST, (message) => {
      const {
        payload: {
          /**
           * @type {FieldSettings}
           */
          fieldSettingsPatch,
        },
      } = message;

      this.fieldModel.setSettings(fieldSettingsPatch);
      this.updateByModel();
      this.sentStatusChanges();
    });
  }

  /**
   * Update field view by model data
   * @param {Object} [options = {}]
   * @param {boolean} [options.silentValidation = false]
   * @private
   */
  updateByModel({ silentValidation = false } = {}) {
    // Recognize view and validators
    this.composedValidator = this.createValidators(
      this.fieldModel.getValidators(),
    );
    if (!silentValidation) {
      this.validate();
    }
    this.fieldNode.setAttributes(
      this.fieldModel.getAttributes(),
    );
    this.fieldNode.setStyle(
      this.fieldModel.getStyle(),
    );
  }

  /**
   * Send field data changes
   * @protected
   */
  sentStatusChanges() {
    this.fieldSlaveChannel.postMessage(
      new Message(
        PATCH_FIELD_STATUS_RESPONSE,
        {
          success: true,
          data: {
            fieldStatusPatch: this.fieldModel.status,
          },
        },
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
