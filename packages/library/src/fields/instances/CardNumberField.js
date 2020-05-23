import { queryString } from '@js-sdk/elements/src/fields/CardNumber/route/queryString';
import { IFrameNode } from '@js-sdk/common/src/nodes/IFrameNode';

import { configSelector } from '../../store/config/selectors';
import { Field } from '../common/Field';
import { makeFieldParamsSelector } from '../common/store/selectors';

/**
 * Create CardNumber field
 * @class SDKCardNumberField
 * @extends SDKField
 */
class CardNumberField extends Field {
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

export default CardNumberField;
export {
  CardNumberField,
};
