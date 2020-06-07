import { queryString } from '@vaulty/elements/src/fields/instances/TextInput/route/queryString';
import { IFrameNode } from '@vaulty/common/src/nodes/IFrameNode';

import { configSelector } from '../../store/config/selectors';
import { Field } from '../common/Field';
import { makeFieldParamsSelector } from '../common/store/selectors';

/**
 * Create TextInput field
 * @class SDKTextInputField
 * @extends SDKField
 */
class TextInputField extends Field {
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

export default TextInputField;
export {
  TextInputField,
};
