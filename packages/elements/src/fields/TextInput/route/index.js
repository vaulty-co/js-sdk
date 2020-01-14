import { FieldRoute } from '@js-sdk/elements/src/router/FieldRoute';

import { TextInput } from '../index';
import { TEXT_INPUT_PARAMS } from './constants';

const inputTextRoute = new FieldRoute(
  'inputText',
  TEXT_INPUT_PARAMS,
  (queryParams) => new TextInput({ channelId: queryParams.get('channelId') }),
);

export default inputTextRoute;
export {
  inputTextRoute,
};
