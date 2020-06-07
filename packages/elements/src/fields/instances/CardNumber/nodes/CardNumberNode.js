import IMask from 'imask';
import cardValidator from 'card-validator';
import { Node } from '@vaulty/common/src/nodes/Node';

import styles from './styles.scss';
import { cardsIcons } from './cardsIcons';

const timesString = (count, character) => (
  Array
    .from({ length: count })
    .reduce((resultString) => `${resultString}${character}`, '')
);

const getMask = (card) => {
  const cardLengthMin = Math.min(...card.lengths);
  const cardLengthMax = Math.max(...card.lengths);

  let maskWithoutGaps = timesString(cardLengthMin, '0');
  maskWithoutGaps += `[${timesString(cardLengthMax - cardLengthMin, '0')}]`;
  maskWithoutGaps = maskWithoutGaps.replace('[]', '');

  return [
    ...card.gaps,
    maskWithoutGaps.length,
  ]
    .reduce(
      (data, gap) => ({
        previousCursor: gap,
        result: [
          ...data.result,
          maskWithoutGaps.substring(data.previousCursor, gap),
        ],
      }),
      {
        previousCursor: 0,
        result: [],
      },
    )
    .result
    .join(' ');
};

const STYLES_FOR_WRAPPER = ['width', 'height'];
const getStyleForInput = (style = {}) => (
  Object
    .keys(style)
    .reduce((resultStyles, name) => {
      if (!STYLES_FOR_WRAPPER.includes(name)) {
        return {
          ...resultStyles,
          [name]: style[name],
        };
      }
      return resultStyles;
    }, {})
);

/**
 * Create card number node with using <input /> element
 * @class
 */
class CardNumberNode extends Node {
  /**
   * @param {Object} [options = {}]
   */
  constructor(options = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = styles.cardNumberWrapper;
    wrapper.innerHTML = `
        <img class="${styles.cardNumberIcon}" src="${cardsIcons.generic}" alt="" />
        <input class="${styles.cardNumberInput}" type="tel" />
    `;

    super({
      ...options,
      node: wrapper,
    });

    this.input = wrapper.querySelector('input');
    this.image = wrapper.querySelector('img');

    this.patternMask = IMask(this.input, {
      mask: '0000 0000 0000 0000',
      lazy: false,
    });

    this.handleInput = this.handleInput.bind(this);
    this.on('input', this.handleInput);
  }

  /**
   * Add event listener
   * @param {string} eventName
   * @param {function(e:Event)} handler
   */
  on(eventName, handler) {
    if (['focus', 'blur'].includes(eventName)) {
      this.input.addEventListener(eventName, handler);
    } else {
      super.on(eventName, handler);
    }
  }

  /**
   * Focus card number node
   */
  focus() {
    this.input.focus();
  }

  /**
   * Blur card number node
   */
  blur() {
    this.input.blur();
  }

  /**
   * Clear card number node
   */
  clear() {
    this.patternMask.value = '';
    this.patternMask.updateControl();
  }

  /**
   * Remove event listener
   * @param {string} eventName
   * @param {function(e:Event)} handler
   */
  off(eventName, handler) {
    if (['focus', 'blur'].includes(eventName)) {
      this.input.removeEventListener(eventName, handler);
    } else {
      super.off(eventName, handler);
    }
  }

  /**
   * Get text input value
   */
  getValue() {
    return this.patternMask.unmaskedValue;
  }

  /**
   * Set style to node
   * @param {Object} [style = {}]
   */
  setStyle(style) {
    const styleForInput = getStyleForInput(style);
    Object.assign(
      this.node,
      style,
    );
    Object.assign(
      this.input,
      styleForInput,
    );
  }

  /**
   * Set attributes to input
   * @param {FieldAttributes} fieldAttributes
   */
  setAttributes(fieldAttributes) {
    if (fieldAttributes.disabled) {
      this.input.setAttribute('disabled', '');
    } else {
      this.input.removeAttribute('disabled');
    }
  }

  /**
   * Destroy component
   */
  destroy() {
    this.off('input', this.handleInput);

    this.patternMask.destroy();
    this.patternMask = null;

    super.destroy();

    this.input = null;
    this.image = null;
  }

  /**
   * Handle input change
   * @private
   */
  handleInput() {
    const value = this.getValue();

    const cardData = cardValidator.number(value);
    const card = cardData?.card ?? { lengths: [16], gaps: [4, 8, 12], type: 'generic' };

    this.patternMask.updateOptions({
      mask: getMask(card),
    });

    this.image.src = cardsIcons[card.type];
  }
}

export default CardNumberNode;
export {
  CardNumberNode,
  getMask,
};
