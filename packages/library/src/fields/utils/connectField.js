import {
  addField,
  removeField,
  setFieldStatus,
} from '../actions';
import { FieldModel } from '../models/FieldModel';
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

      this.dispatchers = actionsToDispatch(options.store)({
        addField,
        removeField,
        setFieldStatus,
      });

      this.add();
    }

    /**
     * Current fields
     * @returns {*}
     */
    get fields() {
      return this.store.getState().fields;
    }

    /**
     * Assigned Field model
     * @returns {?FieldModel}
     */
    get field() {
      if (this.id) {
        return this.fields.getField(this.id);
      }
      return null;
    }

    /**
     * Add field to store, if it is not created
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
        status: FieldModel.STATUSES.MOUNTED,
      });
    }

    destroy(...args) {
      super.destroy(...args);
      this.remove();
    }
  }

  return ConnectedField;
}

export default connectField;
export {
  connectField,
};
