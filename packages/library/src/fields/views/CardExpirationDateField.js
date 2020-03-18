import { queryString } from '@js-sdk/elements/src/fields/CardExpirationDate/route/queryString';
import { IFrameNode } from '@js-sdk/common/src/nodes/IFrameNode';

import { Config } from '../../config';
import { ConnectedField } from './Field';

/**
 * Create CardVerificationCode field
 * @class
 */
class CardExpirationDateField extends ConnectedField {
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

export default CardExpirationDateField;
export {
  CardExpirationDateField,
};
