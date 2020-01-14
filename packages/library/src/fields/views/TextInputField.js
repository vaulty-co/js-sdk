import { queryString } from '@js-sdk/elements/src/fields/TextInput/route/queryString';

import { IFrame } from '../../helpers/IFrame';
import { Config } from '../../config';
import { ConnectedField } from './Field';

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
class TextInputField extends ConnectedField {
  /**
   * @param {FieldOptions} options
   */
  constructor(options) {
    super(options);

    this.fieldIframe = new IFrame({
      width: options?.style?.width ?? '100%',
      height: options?.style?.height ?? '20px',
      src: `${Config.elementsOrigin}?${queryString}&channelId=${this.channelId}`,
    });
  }
}

export default TextInputField;
export {
  TextInputField,
};
