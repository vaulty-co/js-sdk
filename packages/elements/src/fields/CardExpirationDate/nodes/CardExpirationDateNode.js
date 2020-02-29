import IMask from 'imask';
import { TextNode } from '../../../nodes/TextNode';

/**
 * Create card expiration date node
 * @class
 */
class CardExpirationDateNode extends TextNode {
  /**
   * @param {TextNodeOptions} [options = {}]
   */
  constructor(options = {}) {
    super(options);

    this.patternMask = IMask(this.node, {
      mask: '00/00',
      lazy: false,
    });
  }

  /**
   * Get value
   */
  getValue() {
    return this.patternMask.unmaskedValue;
  }

  destroy() {
    super.destroy();

    if (this.patternMask) {
      this.patternMask.destroy();
      this.patternMask = null;
    }
  }
}

export default CardExpirationDateNode;
export {
  CardExpirationDateNode,
};
