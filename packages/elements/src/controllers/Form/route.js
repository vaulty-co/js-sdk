import { ControllerRoute } from 'vaulty-js-sdk-elements/src/router/ControllerRoute';

import { Form } from './index';

const formRoute = new ControllerRoute(
  'form',
  {
    controller: 'form',
  },
  () => new Form(),
);
const queryString = formRoute.getQueryString();

export default formRoute;
export {
  formRoute,
  queryString,
};
