import 'url-search-params-polyfill';

import './styles';
import { CONSTANTS } from './constants';
import { Router } from './router';
import { inputTextRoute } from './fields/TextInput/route';
import { cardNumberRoute } from './fields/CardNumber/route';
import { cardVerificationCodeRoute } from './fields/CardVerificationCode/route';
import { cardExpirationDateRoute } from './fields/CardExpirationDate/route';
import { formRoute } from './controllers/Form/route';

const appNode = document.getElementById(CONSTANTS.APP_ID);
const router = new Router(appNode);
router.register(inputTextRoute);
router.register(cardNumberRoute);
router.register(cardVerificationCodeRoute);
router.register(cardExpirationDateRoute);
router.register(formRoute);
router.render();
