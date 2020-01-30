import { uniqueId } from '../helpers/uniqueId';
import { Node } from './Node';

/**
 * @typedef {Object} IFrameOptions
 * @augments NodeOptions
 * @property {string} [name]
 * @property {string} src
 * @property {string} width
 * @property {string} height
 */

/**
 * Create iframe node by options
 * @param {IFrameOptions} [options = {}]
 */
const createIframe = (options = {}) => {
  const node = document.createElement('iframe');
  node.name = options.name || uniqueId();
  node.src = `${options.src}${options.src.indexOf('?') !== -1 ? '&rnd=' : '?rnd='}${Math.round(Math.random() * 10e5)}`;
  node.frameborder = '0';
  node.allowTransparency = 'true';
  node.scrolling = 'no';
  node.setAttribute('style', [
    'border:0',
    'margin:0',
    'padding:0',
    'background:transparent',
    'display:block',
    `width: ${options.width}`,
    `height: ${options.height}`,
    'overflow: hidden',
  ].join('!important;'));

  return node;
};

/**
 * Create iframe
 * @class
 */
class IFrameNode extends Node {
  /**
   * @param {IFrameOptions} options
   */
  constructor(options = {}) {
    super({
      ...options,
      node: createIframe(options),
    });
  }
}

export default IFrameNode;
export {
  IFrameNode,
};
