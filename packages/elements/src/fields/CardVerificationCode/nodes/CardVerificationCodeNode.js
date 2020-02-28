import IMask from 'imask';
import { TextNode } from '../../../nodes/TextNode';

/**
 * Create card verification code node
 * @class
 */
class CardVerificationCodeNode extends TextNode {
  /**
   * @param {Object} [options = {}]
   * @param {string} [options.type = 'text']
   */
  constructor(options = {}) {
    super(options);

    this.patternMask = IMask(this.node, {
      mask: '000[0]',
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

export default CardVerificationCodeNode;
export {
  CardVerificationCodeNode,
};
