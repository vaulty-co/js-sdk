import { queryString } from '@js-sdk/elements/src/controllers/Form/route/queryString';
import { IFrameNode } from '@js-sdk/common/src/nodes/IFrameNode';
import {
  CONTROLLER_NODE_STATUSES,
  CONTROLLER_READINESS_STATUSES,
} from '@js-sdk/common/src/models/controllers/constants';
import { ControllerModel } from '@js-sdk/common/src/models/controllers/ControllerModel';

import { actionsToDispatch } from '../../store/utils/actionsToDispatch';
import {
  actions,
} from '../store';
import { Config } from '../../config';

const getFieldsIds = (fields = []) => (
  fields.map((field) => field.id)
);

/**
 * @typedef {FormOptions} ConnectedFormOptions
 * @property {Store} store
 */

/**
 * Connect Form to store  instance
 * @param {Form} FormClass
 * @returns {ConnectedForm}
 */
function connectForm(FormClass) {
  class ConnectedForm extends FormClass {
    /**
     * @param {ConnectedFormOptions} [options = {}]
     */
    constructor(options = {}) {
      super(options);

      ConnectedForm.invariant(
        options.store,
        'Connected to store Form should contain redux "store" in options',
      );

      this.store = options.store;

      this.dispatchers = actionsToDispatch(options.store)(actions);

      this.add();
      this.subscribeToStore();

      this.controllerIframe = new IFrameNode({
        width: 0,
        height: 0,
        src: `${Config.elementsOrigin}/?${queryString}&${this.controllerGetParams}`,
      });
      this.appendTo(document.body);
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

    appendTo(node) {
      super.appendTo(node);

      this.dispatchers.setControllerStatus({
        controllerId: this.id,
        status: {
          node: CONTROLLER_NODE_STATUSES.MOUNTED,
        },
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
     * Get controller status
     * Notice: real readiness is computed value by form readiness and fields readiness
     * @returns {ControllerStatus}
     */
    getStatus() {
      const currentStatusByFields = this.controller.getFormStatusByFields(this.state.fields);
      return {
        ...this.controller.status,
        readiness: (
          this.controller.status === CONTROLLER_READINESS_STATUSES.LOADING
          || currentStatusByFields.readiness === CONTROLLER_READINESS_STATUSES.LOADING
        )
          ? CONTROLLER_READINESS_STATUSES.LOADING
          : CONTROLLER_READINESS_STATUSES.READY,
      };
    }

    /**
     * Get current Redux state
     * @return {State}
     */
    get state() {
      return this.store.getState();
    }

    /**
     * Get SDK id
     */
    get sdkId() {
      return this.state.sdkId;
    }

    /**
     * Current controllers
     * @returns {*}
     */
    get controllers() {
      return this.state.controllers;
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
     * Controller GET params
     * @returns {string}
     */
    get controllerGetParams() {
      return `channelId=${this.id}&sdkId=${this.sdkId}`;
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
        this.handleFieldsStatusChange();
        this.handleStatusChange();
        this.previousState = this.state;
      });
    }

    /**
     * Handle Form fields status change
     * @private
     */
    handleFieldsStatusChange() {
      const previousStatus = this.controller.getFormStatusByFields(this.previousState.fields);
      const currentStatus = this.controller.getFormStatusByFields(this.state.fields);
      if (previousStatus.validation !== currentStatus.validation) {
        this.previousState = this.state;
        this.dispatchers.setControllerStatus({
          controllerId: this.id,
          status: {
            validation: currentStatus.validation,
          },
        });
      } else if (previousStatus.readiness !== currentStatus.readiness) {
        this.events.emit('status', this.getStatus());
      }
    }

    /**
     * Handle Form status change
     * @private
     */
    handleStatusChange() {
      const previousStatus = this.previousState.controllers.getController(this.id).status;
      if (previousStatus !== this.controller.status) {
        this.events.emit('status', this.getStatus());
      }
    }
  }

  return ConnectedForm;
}

export default connectForm;
export {
  connectForm,
};
