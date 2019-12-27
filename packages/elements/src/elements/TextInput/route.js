import { Route } from 'vaulty-js-sdk-elements/src/router/Route';

import { TextInput } from './index';

const inputTextRoute = new Route(
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
