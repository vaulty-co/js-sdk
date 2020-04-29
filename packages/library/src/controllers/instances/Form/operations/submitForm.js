import { Message } from '@js-sdk/common/src/channels/Message';
import { ControllerModel } from '@js-sdk/common/src/models/controllers/ControllerModel';
import {
  SUBMIT_REQUEST,
  SUBMIT_RESPONSE,
} from '@js-sdk/elements/src/controllers/instances/Form/messages';

import { actions } from '../../../common/store/index';
import {
  FORM_HAS_UNFINISHED_PROCESS,
  FORM_IS_NOT_VALID,
  NO_FIELDS_ERROR,
} from '../events/noFieldsError';
import {
  makeControllerSelector,
  makeControllerStatusSelector,
} from '../../../common/store/selectors';

/**
 * Operation for submitting form controller
 * @param {string} id
 * @param {FormSubmitOptions} options
 * @param {Function} successCallback
 * @param {Function} errorCallback
 * @return {operationResult}
 */
const operationSubmitForm = (
  { id, options },
  successCallback = Function.prototype,
  errorCallback = Function.prototype,
) => (
  (dispatch, getState, channels) => {
    const state = getState();
    const form = makeControllerSelector(id)(state);
    const status = makeControllerStatusSelector(id)(state);
    let error;
    if (form.fieldsIds.length === 0) {
      error = NO_FIELDS_ERROR;
    }
    if (status.readiness === ControllerModel.STATUSES.READINESS.LOADING) {
      error = FORM_HAS_UNFINISHED_PROCESS;
    }
    if (status.validation === ControllerModel.STATUSES.VALIDATION.INVALID) {
      error = FORM_IS_NOT_VALID;
    }
    if (error) {
      errorCallback(error);
    }

    dispatch(
      actions.setControllerStatus({
        controllerId: id,
        status: {
          readiness: ControllerModel.STATUSES.READINESS.LOADING,
        },
      }),
    );

    const controllerChannel = channels.getChannel(id);
    controllerChannel.postMessage(
      new Message(SUBMIT_REQUEST, options),
    );
    controllerChannel.subscribe(SUBMIT_RESPONSE, (message) => {
      if (message.payload.success) {
        const { data: { controllerStatusPatch } } = message.payload;
        dispatch(
          actions.setControllerStatus({
            controllerId: id,
            status: controllerStatusPatch,
          }),
        );
        successCallback();
      }
    });
  }
);

export default operationSubmitForm;
export {
  operationSubmitForm,
};
