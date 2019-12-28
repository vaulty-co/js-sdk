import { FieldRoute } from 'vaulty-js-sdk-elements/src/router/FieldRoute';

import { TextInput } from './index';

const inputTextRoute = new FieldRoute(
  'inputText',
  {
    field: 'input',
    type: 'text',
  },
  () => new TextInput(),
);
const queryString = inputTextRoute.getQueryString();

export default inputTextRoute;
export {
  inputTextRoute,
  queryString,
};
