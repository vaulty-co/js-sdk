import { ElementRoute } from 'vaulty-js-sdk-elements/src/router/ElementRoute';

import { TextInput } from './index';

const inputTextRoute = new ElementRoute(
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
