import { queryString } from '@js-sdk/elements/src/fields/TextInput/route/queryString';
import { IFrameNode } from '@js-sdk/common/src/nodes/IFrameNode';

import { Config } from '../../config';
import { ConnectedField } from './Field';

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
      width: this.field.settings.style.width,
      height: this.field.settings.style.height,
      src: `${Config.elementsOrigin}?${queryString}&${this.fieldGetParams}`,
    });
  }
}

export default TextInputField;
export {
  TextInputField,
};
