import { ControllerRoute } from '@js-sdk/elements/src/router/ControllerRoute';

import { Form } from '../index';
import { FORM_PARAMS } from './constants';

const formRoute = new ControllerRoute(
  'form',
  FORM_PARAMS,
  (queryParams) => new Form({ channelId: queryParams.get('channelId') }),
);

export default formRoute;
export {
  formRoute,
};
