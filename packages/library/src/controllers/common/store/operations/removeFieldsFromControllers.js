import { Message } from '@js-sdk/common/src/channels/Message';
import {
  REMOVE_FIELDS_IDS_FROM_CONTROLLER_REQUEST,
  REMOVE_FIELDS_IDS_FROM_CONTROLLER_RESPONSE,
} from '@js-sdk/elements/src/controllers/common/Controller/messages';

import { actions } from '../storeArtifacts';
import { controllersSelector } from '../selectors';

/**
 * Operation for removing fields from controllers
 * @param {string} id
 * @return {operationResult}
 */
const operationRemoveFieldsFromControllers = ({ fieldsIds }) => (
  (dispatch, getState, channels) => {
    dispatch(
      actions.removeFieldsFromControllers({
        fieldsIds,
      }),
    );

    controllersSelector(getState())
      .forEach((controller) => {
        const controllerChannel = channels.getChannel(controller.id);

        controllerChannel.postMessage(new Message(
          REMOVE_FIELDS_IDS_FROM_CONTROLLER_REQUEST,
          {
            fieldsIdsPatch: fieldsIds,
          },
        ));

        controllerChannel.subscribe(REMOVE_FIELDS_IDS_FROM_CONTROLLER_RESPONSE, (message) => {
          if (message.payload.error) {
            dispatch(
              actions.addFieldsToController({
                controllerId: controller.id,
                fieldsIds,
              }),
            );
          }
        });
      });
  }
);

export default operationRemoveFieldsFromControllers;
export {
  operationRemoveFieldsFromControllers,
};
