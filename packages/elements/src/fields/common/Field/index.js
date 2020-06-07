import { SlaveChannel } from '@vaulty/common/src/channels/SlaveChannel';
import { Message } from '@vaulty/common/src/channels/Message';
import { createBroadcastChannel } from '@vaulty/common/src/channels/utils';
import { Node } from '@vaulty/common/src/nodes/Node';
import { ComposedValidator } from '@vaulty/common/src/validators/ComposedValidator';
import { FieldModel } from '@vaulty/common/src/models/fields/FieldModel';
import { staticInvariant } from '@vaulty/common/src/helpers/invariant';

import { Config } from '../../../config';
import { VALIDATORS_TYPES } from '../../../validators/constants';
import { VALIDATORS_REGISTRY } from '../../../validators/registry';
import { putFieldHandler } from '../handlers/putField';
import { patchStatusHandler } from '../handlers/patchStatus';
import { patchSettingsHandler } from '../handlers/patchSettings';
import {
  PUT_FIELD_REQUEST,
  PATCH_FIELD_SETTINGS_REQUEST,
  PATCH_FIELD_STATUS_REQUEST,
  FIELD_STATUS_WATCHER,
  FIELD_LOADED_WATCHER,
} from './messages';

const FIELD_STATUSES = {
  INIT: 'init',
  DESTROYED: 'destroyed',
};

/**
 * Base class for Field
 * @class FieldElement
 * @extends ElementsInstance
 */
class Field {
  static get invariant() {
    return staticInvariant;
  }

  static get STATUSES() {
    return FIELD_STATUSES;
  }

  /**
   * @param {FieldElementOptions} options
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
      new Message(FIELD_LOADED_WATCHER),
    );
  }

  /**
   * Register allowed messages by master frame and give response by this messages
   * @private
   */
  registerHandlers() {
    this.fieldSlaveChannel.subscribe(PUT_FIELD_REQUEST, putFieldHandler.bind(this));
    this.fieldSlaveChannel.subscribe(PATCH_FIELD_STATUS_REQUEST, patchStatusHandler.bind(this));
    this.fieldSlaveChannel.subscribe(PATCH_FIELD_SETTINGS_REQUEST, patchSettingsHandler.bind(this));
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
   * Send field status changes
   * @protected
   */
  sendStatusChanges() {
    this.fieldSlaveChannel.postMessage(
      new Message(
        FIELD_STATUS_WATCHER,
        {
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
