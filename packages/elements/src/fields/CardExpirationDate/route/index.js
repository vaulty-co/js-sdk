import { FieldRoute } from '@js-sdk/elements/src/router/FieldRoute';

import { CardExpirationDate } from '../index';
import { CARD_EXPIRATION_DATE_PARAMS } from './constants';

const cardExpirationDateRoute = new FieldRoute(
  'cardExpirationDate',
  CARD_EXPIRATION_DATE_PARAMS,
  (queryParams) => new CardExpirationDate({
    channelId: queryParams.get('channelId'),
    sdkId: queryParams.get('sdkId'),
  }),
);

export default cardExpirationDateRoute;
export {
  cardExpirationDateRoute,
};
