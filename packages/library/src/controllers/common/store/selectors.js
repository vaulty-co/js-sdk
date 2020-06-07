import { createSelector } from 'reselect';
import { FieldModel } from '@vaulty/common/src/models/fields/FieldModel';
import { ControllerModel } from '@vaulty/common/src/models/controllers/ControllerModel';

import { createShallowEqualSelector } from '../../../store/utils/createShallowEqualSelector';
import { sdkIdSelector } from '../../../store/selectors';
import { fieldsSelector } from '../../../fields/common/store/selectors';

/**
 * @param {SDKState} state
 * @return {ControllersCollection}
 */
const controllersSelector = (state) => state.controllers;

/**
 * @param {string} controllerId
 * @return {controllerSelector}
 */
const makeControllerSelector = (controllerId) => (
  createSelector(
    controllersSelector,
    (controllers) => controllers.getController(controllerId),
  )
);

/**
 * @param {string} controllerId
 * @return {controllerFieldsSelector}
 */
const makeControllerFieldsSelector = (controllerId) => {
  const controllerSelector = makeControllerSelector(controllerId);
  const controllerFieldsSelector = createSelector(
    [fieldsSelector, controllerSelector],
    (fieldsCollection, controller) => (
      controller.fieldsIds.map((fieldId) => (
        fieldsCollection.getField(fieldId)
      ))
    ),
  );
  return createShallowEqualSelector(
    controllerFieldsSelector,
    (fields) => fields,
  );
};

/**
 * @param {string} controllerId
 * @return {controllerParamsSelector}
 */
const makeControllerParamsSelector = (controllerId) => (
  createSelector(
    sdkIdSelector,
    (sdkId) => `channelId=${controllerId}&sdkId=${sdkId}`,
  )
);

/**
 * @param {string} controllerId
 * @return {controllerStatusSelector}
 */
const makeControllerStatusSelector = (controllerId) => {
  const controllerSelector = makeControllerSelector(controllerId);
  const controllerFieldsSelector = makeControllerFieldsSelector(controllerId);
  const controllerStatusSelector = createSelector(
    [controllerFieldsSelector, controllerSelector],
    (controllerFields, controller) => {
      const isFieldsReady = controllerFields.every((field) => (
        field.status.readiness === FieldModel.STATUSES.READINESS.READY
      ));
      const isFieldsValid = controllerFields.every((field) => (
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
  return createShallowEqualSelector(
    controllerStatusSelector,
    (status) => status,
  );
};

export {
  controllersSelector,
  makeControllerSelector,
  makeControllerParamsSelector,
  makeControllerStatusSelector,
};
