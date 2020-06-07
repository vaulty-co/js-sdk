import pick from '@vaulty/common/src/helpers/pick';
import { FieldModel } from '@vaulty/common/src/models/fields/FieldModel';
import { ALLOWED_FIELD_SETTINGS } from '@vaulty/common/src/models/fields/constants';

import { actions } from '../storeArtifacts';

/**
 * Operation for creating field
 * @param {FieldModelOptions} options
 * @return {operationResult}
 */
const operationCreateField = (options) => (
  (dispatch) => {
    const { id, type, settings } = options;
    const allowedSettings = pick(settings, ALLOWED_FIELD_SETTINGS);
    const field = new FieldModel({
      id,
      type,
      settings: allowedSettings,
    });
    dispatch(actions.addField(field));
  }
);

export default operationCreateField;
export {
  operationCreateField,
};
