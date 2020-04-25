import { queryString } from '@js-sdk/elements/src/fields/CardExpirationDate/route/queryString';
import { IFrameNode } from '@js-sdk/common/src/nodes/IFrameNode';

import { Config } from '../../config';
import { Field } from '../common/Field';
import { makeFieldParamsSelector } from '../common/store/selectors';

/**
 * Create CardVerificationCode field
 * @class
 */
class CardExpirationDateField extends Field {
  /**
   * @param {FieldOptions} options
   */
  constructor(options) {
    super(options);

    const state = options.store.getState();
    const field = this.fieldSelector(state);
    const fieldParams = makeFieldParamsSelector(this.id)(state);
    this.fieldIframe = new IFrameNode({
      width: field.getStyle('width'),
      height: field.getStyle('height'),
      src: `${Config.elementsOrigin}?${queryString}&${fieldParams}`,
    });
  }
}

export default CardExpirationDateField;
export {
  CardExpirationDateField,
};
