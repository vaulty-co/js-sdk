import { queryString } from '@js-sdk/elements/src/fields/TextInput/route/queryString';
import { IFrameNode } from '@js-sdk/utils/src/nodes/IFrameNode';

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

    this.fieldIframe = new IFrameNode({
      width: this.style.width,
      height: this.style.height,
      src: `${Config.elementsOrigin}?${queryString}&${this.fieldGetParams}`,
    });
  }
}

export default TextInputField;
export {
  TextInputField,
};
