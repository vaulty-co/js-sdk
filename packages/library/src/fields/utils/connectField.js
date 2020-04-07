import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';
import { pick } from '@js-sdk/common/src/helpers/pick';
import { ALLOWED_FIELD_SETTINGS } from '@js-sdk/common/src/models/fields/constants';

import {
  actions,
} from '../store';
import { actionsToDispatch } from '../../store/utils/actionsToDispatch';

/**
 * Connect Field to store  instance
 * @param {Field} FieldClass
 * @returns {ConnectedField}
 */
function connectField(FieldClass) {
  class ConnectedField extends FieldClass {
    constructor(options) {
      super(options);

      ConnectedField.invariant(
        options.store,
        'Connected to store Field should contain redux "store" in options',
      );

      this.store = options.store;

      /**
       * @type {Object<Function>}
       * @protected
       */
      this.dispatchers = actionsToDispatch(options.store)(actions);

      this.add();
    }

    /**
     * Set field status
     * @param {FieldStatus} status
     * @protected
     */
    setFieldStatus(status) {
      this.dispatchers.setFieldStatus({
        fieldId: this.id,
        status,
      });
      this.events.emit('status', this.field.status);
    }

    /**
     * Get SDK id
     * @returns {string}
     */
    get sdkId() {
      return this.store.getState().sdkId;
    }

    /**
     * Current fields
     * @returns {*}
     * @private
     */
    get fields() {
      return this.store.getState().fields;
    }

    /**
     * Assigned Field model
     * @returns {?FieldModel}
     * @private
     */
    get field() {
      if (this.id) {
        return this.fields.getField(this.id);
      }
      return null;
    }

    /**
     * Field GET params
     * @returns {string}
     */
    get fieldGetParams() {
      return `channelId=${this.id}&sdkId=${this.sdkId}`;
    }

    /**
     * Add field to store, if it is not created
     * @private
     */
    add() {
      if (!this.id) {
        const settings = pick(this.options, ALLOWED_FIELD_SETTINGS);
        const model = new FieldModel({
          type: FieldClass.name,
          settings,
        });
        this.id = model.id;
        this.dispatchers.addField(model);
      }
    }

    /**
     * Remove field from store
     * @private
     */
    remove() {
      this.constructor.invariant(
        Boolean(this.id),
        'Field should be added before removing from store',
      );
      this.dispatchers.removeField(this.field);
    }

    appendTo(...args) {
      super.appendTo(...args);

      this.dispatchers.setFieldStatus({
        fieldId: this.id,
        status: {
          node: FieldModel.STATUSES.NODE.MOUNTED,
        },
      });
    }

    destroy(...args) {
      super.destroy(...args);

      this.remove();
      this.dispatchers = null;
    }
  }

  return ConnectedField;
}

export default connectField;
export {
  connectField,
};
