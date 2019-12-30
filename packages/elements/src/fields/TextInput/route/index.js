import { FieldRoute } from 'vaulty-js-sdk-elements/src/router/FieldRoute';

import { TextInput } from '../index';
import { TEXT_INPUT_PARAMS } from './constants';

const inputTextRoute = new FieldRoute(
  'inputText',
  TEXT_INPUT_PARAMS,
  () => new TextInput(),
);

export default inputTextRoute;
export {
  inputTextRoute,
};
