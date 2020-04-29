import { createSelector } from 'reselect';
import { FieldModel } from '@js-sdk/common/src/models/fields/FieldModel';
import { ControllerModel } from '@js-sdk/common/src/models/controllers/ControllerModel';

import { sdkIdSelector } from '../../../store/selectors';
import { fieldsSelector } from '../../../fields/common/store/selectors';

/**
 * @param {SDKState} state
 * @return {ControllersCollection}
 */
const controllersSelector = (state) => state.controllers;

/**
 * @param {string} controllerId
 * @return {function(state: SDKState): ?ControllerModel}
 */
const makeControllerSelector = (controllerId) => (
  createSelector(
    controllersSelector,
    (controllers) => controllers.getController(controllerId),
  )
);

/**
 * @param {string} controllerId
 * @return {function(state: SDKState): string}
 */
const makeControllerParamsSelector = (controllerId) => (
  createSelector(
    sdkIdSelector,
    (sdkId) => `channelId=${controllerId}&sdkId=${sdkId}`,
  )
);

/**
 * @param {string} controllerId
 * @return {function(state: SDKState): ComputedControllerStatus}
 */
const makeControllerStatusSelector = (controllerId) => {
  const controllerSelector = makeControllerSelector(controllerId);
  return createSelector(
    [fieldsSelector, controllerSelector],
    (fieldsCollection, controller) => {
      const fields = controller.fieldsIds.map((fieldId) => (
        fieldsCollection.getField(fieldId)
      ));
      const isFieldsReady = fields.every((field) => (
        field.status.readiness === FieldModel.STATUSES.READINESS.READY
      ));
      const isFieldsValid = fields.every((field) => (
        field.status.validation.status === FieldModel.STATUSES.VALIDATION.VALID
      ));
      return {
        ...controller.status,
        readiness: (
          controller.status.readiness === ControllerModel.STATUSES.READINESS.READY
          && isFieldsReady
            ? ControllerModel.STATUSES.READINESS.READY
            : ControllerModel.STATUSES.READINESS.LOADING
        ),
        validation: isFieldsValid
          ? ControllerModel.STATUSES.VALIDATION.VALID
          : ControllerModel.STATUSES.VALIDATION.INVALID,
      };
    },
  );
};

export {
  controllersSelector,
  makeControllerSelector,
  makeControllerParamsSelector,
  makeControllerStatusSelector,
};
