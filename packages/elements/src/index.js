import 'url-search-params-polyfill';

import './styles';
import { CONSTANTS } from './constants';
import { TextInput } from './elements/TextInput';

const appNode = document.getElementById(CONSTANTS.APP_ID);
const queryParams = new URLSearchParams(window.location.search);
const fieldElement = queryParams.get('element');
const fieldType = queryParams.get('type');

if (fieldElement === 'input' && fieldType === 'text') {
  const textInput = new TextInput();
  textInput.appendTo(appNode);
}
