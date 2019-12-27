import 'url-search-params-polyfill';

import './styles';
import { CONSTANTS } from './constants';
import { Router } from './router';
import { inputTextRoute } from './elements/TextInput/route';

const appNode = document.getElementById(CONSTANTS.APP_ID);
const router = new Router(appNode);
router.register(inputTextRoute);
router.render();
