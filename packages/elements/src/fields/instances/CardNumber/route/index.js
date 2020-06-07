import { FieldRoute } from '@vaulty/elements/src/router/FieldRoute';

import { CardNumber } from '../index';
import { CARD_NUMBER_PARAMS } from './constants';

const cardNumberRoute = new FieldRoute(
  'cardNumber',
  CARD_NUMBER_PARAMS,
  (queryParams) => new CardNumber({
    channelId: queryParams.get('channelId'),
    sdkId: queryParams.get('sdkId'),
  }),
);

export default cardNumberRoute;
export {
  cardNumberRoute,
};
