import { FieldRoute } from '@vaulty/elements/src/router/FieldRoute';

import { TextInput } from '../index';
import { TEXT_INPUT_PARAMS } from './constants';

const inputTextRoute = new FieldRoute(
  'inputText',
  TEXT_INPUT_PARAMS,
  (queryParams) => new TextInput({
    channelId: queryParams.get('channelId'),
    sdkId: queryParams.get('sdkId'),
  }),
);

export default inputTextRoute;
export {
  inputTextRoute,
};
