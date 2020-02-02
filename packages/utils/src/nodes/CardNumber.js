import IMask from 'imask';
import cardValidator from 'card-validator';

import { Node } from './Node';

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

/**
 * Create card number node with using <input /> element
 * @class
 */
class CardNumber extends Node {
  /**
   * @param {Object} [options = {}]
   */
  constructor(options = {}) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = '<input type="tel" />';

    super({
      ...options,
      node: wrapper,
    });

    this.input = wrapper.querySelector('input');

    this.patternMask = IMask(this.input, {
      mask: '0000 0000 0000 0000',
      lazy: false,
    });

    this.handleInput = this.handleInput.bind(this);
    this.on('input', this.handleInput);
  }

  /**
   * Get text input value
   */
  getValue() {
    return this.patternMask.unmaskedValue;
  }

  addClass(className) {
    super.addClass.call({ node: this.input }, className);
  }

  removeClass(className) {
    super.removeClass().call({ node: this.input }, className);
  }

  /**
   * Handle input change
   */
  handleInput() {
    const value = this.getValue();

    const cardData = cardValidator.number(value);
    const card = cardData?.card ?? { lengths: [16], gaps: [4, 8, 12] };

    this.patternMask.updateOptions({
      mask: getMask(card),
    });
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
  }
}

export default CardNumber;
export {
  CardNumber,
  getMask,
};
