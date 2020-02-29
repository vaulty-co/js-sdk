import { queryString } from '@js-sdk/elements/src/fields/CardExpirationDate/route/queryString';
import { IFrameNode } from '@js-sdk/utils/src/nodes/IFrameNode';

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
      width: this.style.width,
      height: this.style.height,
      src: `${Config.elementsOrigin}?${queryString}&${this.fieldGetParams}`,
    });
  }
}

export default CardExpirationDateField;
export {
  CardExpirationDateField,
};
