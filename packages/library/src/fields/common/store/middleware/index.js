import thunk from 'redux-thunk';

import { FieldsChannels } from './FieldsChannels';

const fieldsChannels = new FieldsChannels();
const fieldMiddleware = thunk.withExtraArgument(fieldsChannels);

export {
  fieldMiddleware,
  fieldsChannels,
};
