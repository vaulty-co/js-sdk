import { actionsToDispatch } from '../../store/utils/actionsToDispatch';
import {
  addController,
  removeController,
  addFieldsToController,
  removeFieldsFromController,
} from '../actions';
import { ControllerModel } from '../models/ControllerModel';

const getFieldsIds = (fields = []) => (
  fields.map((field) => field.id)
);

/**
 * Connect Form to store  instance
 * @param {Form} FormClass
 * @returns {ConnectedForm}
 */
function connectForm(FormClass) {
  class ConnectedForm extends FormClass {
    /**
     * @param {Object} [options = {}]
     * @param {Store} options.store
     */
    constructor(options = {}) {
      super(options);

      ConnectedForm.invariant(
        options.store,
        'Connected to store Form should contain redux "store" in options',
      );

      this.store = options.store;

      this.dispatchers = actionsToDispatch(options.store)({
        addController,
        removeController,
        addFieldsToController,
        removeFieldsFromController,
      });

      this.add();
      this.subscribeToStore();
    }

    addFields(fields) {
      super.addFields(fields);

      this.dispatchers.addFieldsToController({
        controllerId: this.id,
        fieldsIds: getFieldsIds(fields),
      });
    }

    removeFields(fields) {
      super.removeFields(fields);

      this.dispatchers.removeFieldsFromController({
        controllerId: this.id,
        fieldsIds: getFieldsIds(fields),
      });
    }

    removeAllFields() {
      super.removeAllFields();

      this.dispatchers.removeFieldsFromController({
        controllerId: this.id,
        fieldsIds: getFieldsIds(this.fields),
      });
    }

    destroy(...args) {
      this.remove();

      if (this.unsubscribeStore) {
        this.unsubscribeStore();
      }
      this.previousState = null;
      this.dispatchers = null;

      super.destroy(...args);
    }

    /**
     * Current controllers
     * @returns {*}
     */
    get controllers() {
      return this.store.getState().controllers;
    }

    /**
     * Assigned Controller model
     * @returns {?ControllerModel}
     */
    get controller() {
      if (this.id) {
        return this.controllers.getController(this.id);
      }
      return null;
    }

    /**
     * Get current Redux state
     * @return {State}
     */
    get state() {
      return this.store.getState();
    }

    /**
     * Add controller in store
     * @private
     */
    add() {
      if (!this.id) {
        const model = new ControllerModel({
          type: FormClass.name,
          fieldsIds: getFieldsIds(this.fields),
        });
        this.id = model.id;
        this.dispatchers.addController(model);
      }
    }

    /**
     * Remove controller from store
     * @private
     */
    remove() {
      this.constructor.invariant(
        Boolean(this.id),
        'Form should be added before removing from store',
      );
      this.dispatchers.removeController(this.controller);
    }

    /**
     * Subscribe to store
     * @private
     */
    subscribeToStore() {
      this.previousState = this.state;
      this.unsubscribeStore = this.store.subscribe(() => {
        this.handleStatusChange();
        this.previousState = this.state;
      });
    }

    /**
     * Handle Form status change
     * @private
     */
    handleStatusChange() {
      const previousFormStatus = this.controller.getStatus(this.previousState.fields);
      const formStatus = this.controller.getStatus(this.state.fields);
      if (previousFormStatus !== formStatus) {
        this.events.emit('status', formStatus);
      }
    }
  }

  return ConnectedForm;
}

export default connectForm;
export {
  connectForm,
};