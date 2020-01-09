import { queryString } from '@js-sdk/elements/src/fields/TextInput/route/queryString';
import get from 'lodash/get';

import { Field } from './Field';
import { connectField } from '../utils/connectField';
import { IFrame } from '../../helpers/IFrame';

/**
 * @typedef {Object} TextInputFieldStyle
 * @property {string} [width = '100%'] - width of text input field
 * @property {string} [height = '20px'] - height of text input field
 */

/**
 * @typedef {Object} TextInputFieldOptions
 * @extends {FieldOptions}
 * @property {TextInputFieldStyle} style
 */

/**
 * Create TextInput field
 * @class
 */
class TextInputField extends Field {
  /**
   * @param {FieldOptions} options
   */
  constructor(options) {
    super(options);

    // FIXME - fixme URL hardcode with using config
    this.fieldIframe = new IFrame({
      width: get(options, 'style.width', '100%'),
      height: get(options, 'style.height', '20px'),
      src: `http://localhost:3001/?${queryString}`,
    });
  }
}

const ConnectedTextInputField = connectField(TextInputField);

export default TextInputField;
export {
  TextInputField,
  ConnectedTextInputField,
};
