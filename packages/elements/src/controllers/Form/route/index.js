import { ControllerRoute } from 'vaulty-js-sdk-elements/src/router/ControllerRoute';

import { Form } from '../index';
import { FORM_PARAMS } from './constants';

const formRoute = new ControllerRoute(
  'form',
  FORM_PARAMS,
  () => new Form(),
);

export default formRoute;
export {
  formRoute,
};
