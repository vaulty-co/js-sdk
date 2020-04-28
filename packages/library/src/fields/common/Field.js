import EventEmitter from 'events';
import uniqueId from '@js-sdk/common/src/helpers/uniqueId';
import { staticInvariant } from '@js-sdk/common/src/helpers/invariant';
import FieldModel from '@js-sdk/common/src/models/fields/FieldModel';

import { actionsToDispatch } from '../../store/utils/actionsToDispatch';
import { operationCreateField } from './store/operations/createField';
import { operationMountField } from './store/operations/mountField';
import { operationDestroyField } from './store/operations/destroyField';
import { operationUpdateFieldSettings } from './store/operations/updateFieldSettings';
import { operationUpdateFieldStatus } from './store/operations/updateFieldStatus';
import {
  makeFieldSelector,
} from './store/selectors';

/**
 * @class
 */
class Field {
  static get invariant() {
    return staticInvariant;
  }

  /**
   * @param {FieldOptions} options
   */
  constructor(options = {}) {
    /**
     * @type {string}
     * @protected
     */
    this.id = uniqueId();
    /**
     * @type {FieldOptions}
     * @protected
     */
    this.options = options;
    /**
     * @type {?EventEmitter}
     * @protected
     */
    this.events = new EventEmitter();
    /**
     * @type {?IFrameNode}
     * @protected
     */
    this.fieldIframe = null;
    /**
     * Field selector
     * @type {function(SDKState): ?FieldModel}
     * @protected
     */
    this.fieldSelector = makeFieldSelector(this.id);

    /**
     * @type {Object.<string, operation>}
     * @protected
     */
    this.operations = actionsToDispatch(options.store)({
      createField: operationCreateField,
      mountField: operationMountField,
      updateFieldSettings: operationUpdateFieldSettings,
      updateFieldStatus: operationUpdateFieldStatus,
      destroyField: operationDestroyField,
    });
    this.operations.createField({
      id: this.id,
      type: this.constructor.name,
      settings: options,
    });

    let currentField = this.fieldSelector(options.store.getState());
    const unsubscribe = options.store.subscribe(() => {
      const previousField = currentField;
      currentField = this.fieldSelector(options.store.getState());
      if (!currentField) {
        this.fieldIframe.destroy();
        this.fieldIframe = null;
        this.events.removeAllListeners();
        this.events = null;
        unsubscribe();
      } else if (previousField.status !== currentField.status) {
        this.events.emit('status', currentField.status);
      }
    });
  }

  /**
   * Append field in some DOM node
   * @param {string|HTMLElement} parentNode - valid css selector or DOM node, where element should be appended
   */
  appendTo(parentNode) {
    this.constructor.invariant(
      Boolean(this.fieldIframe),
      'IFrameNode should exist in field',
    );

    this.fieldIframe.appendTo(parentNode);
    this.operations.mountField({
      id: this.id,
      iframeDomNode: this.fieldIframe.node,
    });
  }

  /**
   * Update field settings
   * @param {FieldSettings} settings
   */
  update(settings) {
    this.operations.updateFieldSettings({
      id: this.id,
      settings,
    });
  }

  /**
   * Get field status
   * @returns {FieldStatus}
   */
  getStatus() {
    const field = this.fieldSelector(this.options.store.getState());
    return field.status;
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
    this.operations.updateFieldStatus({
      id: this.id,
      status: {
        focus: FieldModel.STATUSES.FOCUS.FOCUSED,
      },
    });
  }

  /**
   * Blur field
   */
  blur() {
    this.operations.updateFieldStatus({
      id: this.id,
      status: {
        focus: FieldModel.STATUSES.FOCUS.UNFOCUSED,
      },
    });
  }

  /**
   * Clear field value
   */
  clear() {
    this.operations.updateFieldStatus({
      id: this.id,
      status: {
        content: FieldModel.STATUSES.CONTENT.EMPTY,
      },
    });
  }

  /**
   * Destroy field and its DOM tree. It does not destroy parent, where field have been placed.
   * Field is not usable after destroy
   */
  destroy() {
    this.operations.destroyField({ id: this.id });
  }
}

export default Field;
export {
  Field,
};
