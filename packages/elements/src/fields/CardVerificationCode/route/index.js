import { FieldRoute } from '@js-sdk/elements/src/router/FieldRoute';

import { CardVerificationCode } from '../index';
import { CARD_VERIFICATION_CODE_PARAMS } from './constants';

const cardVerificationCodeRoute = new FieldRoute(
  'cardVerificationCode',
  CARD_VERIFICATION_CODE_PARAMS,
  (queryParams) => new CardVerificationCode({
    channelId: queryParams.get('channelId'),
    sdkId: queryParams.get('sdkId'),
  }),
);

export default cardVerificationCodeRoute;
export {
  cardVerificationCodeRoute,
};
