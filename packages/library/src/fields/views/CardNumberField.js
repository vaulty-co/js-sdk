import { queryString } from '@js-sdk/elements/src/fields/CardNumber/route/queryString';
import { IFrameNode } from '@js-sdk/common/src/nodes/IFrameNode';

import { Config } from '../../config';
import { ConnectedField } from './Field';

/**
 * Create CardNumber field
 * @class
 */
class CardNumberField extends ConnectedField {
  /**
   * @param {FieldOptions} options
   */
  constructor(options) {
    super(options);

    this.fieldIframe = new IFrameNode({
      width: this.field.getStyle('width'),
      height: this.field.getStyle('height'),
      src: `${Config.elementsOrigin}?${queryString}&${this.fieldGetParams}`,
    });
  }
}

export default CardNumberField;
export {
  CardNumberField,
};
