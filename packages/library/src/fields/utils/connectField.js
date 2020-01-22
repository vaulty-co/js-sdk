import {
  addField,
  removeField,
  setFieldStatus,
} from '../actions';
import { FieldModel } from '../models/FieldModel';
import { FIELD_NODE_STATUSES } from '../constants';
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
      this.dispatchers = actionsToDispatch(options.store)({
        addField,
        removeField,
        setFieldStatus,
      });

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
     * Add field to store, if it is not created
     * @private
     */
    add() {
      if (!this.id) {
        const model = new FieldModel({
          type: FieldClass.name,
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
          node: FIELD_NODE_STATUSES.MOUNTED,
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
