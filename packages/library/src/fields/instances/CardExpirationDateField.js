import { queryString } from '@js-sdk/elements/src/fields/CardExpirationDate/route/queryString';
import { IFrameNode } from '@js-sdk/common/src/nodes/IFrameNode';

import { configSelector } from '../../store/config/selectors';
import { Field } from '../common/Field';
import { makeFieldParamsSelector } from '../common/store/selectors';

/**
 * Create CardVerificationCode field
 * @class SDKCardExpirationDateField
 * @extends SDKField
 */
class CardExpirationDateField extends Field {
  /**
   * @param {SDKFieldOptions} options
   */
  constructor(options) {
    super(options);

    const state = options.store.getState();
    const config = configSelector(state);
    const field = this.fieldSelector(state);
    const fieldParams = makeFieldParamsSelector(this.id)(state);
    this.fieldIframe = new IFrameNode({
      width: field.getStyle('width'),
      height: field.getStyle('height'),
      src: `${config.elementsOrigin}?${queryString}&${fieldParams}`,
    });
  }
}

export default CardExpirationDateField;
export {
  CardExpirationDateField,
};
