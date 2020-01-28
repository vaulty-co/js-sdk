import EventEmitter from 'events';
import { uniqueId } from '@js-sdk/utils/src/helpers/uniqueId';


/**
 * @typedef {Object} IFrameOptions
 * @property {string} [name]
 * @property {string} src
 * @property {string} width
 * @property {string} height
 */

/**
 * Create iframe
 */
class IFrame {
  /**
   * @param {?IFrameOptions} options
   */
  constructor(options) {
    this.options = options;
    this.events = new EventEmitter();
    this.createNode();
    this.attachEvents();
  }

  /**
   * Crete iframe node
   * @private
   */
  createNode() {
    const node = document.createElement('iframe');
    node.name = this.options?.name ?? uniqueId();
    node.src = `${this.options.src}${this.options.src.indexOf('?') !== -1 ? '&rnd=' : '?rnd='}${Math.round(Math.random() * 10e5)}`;
    node.frameborder = '0';
    node.allowTransparency = 'true';
    node.scrolling = 'no';
    node.setAttribute('style', [
      'border:0',
      'margin:0',
      'padding:0',
      'background:transparent',
      'display:block',
      `width: ${this.options.width}`,
      `height: ${this.options.height}`,
      'overflow: hidden',
    ].join('!important;'));

    /**
     * @type {HTMLIFrameElement}
     * @private
     */
    this.node = node;
  }

  /**
   * Attach events to iframe node
   * @private
   */
  attachEvents() {
    this.handleSuccess = this.onSuccess.bind(this);
    this.handleError = this.onError.bind(this);
    this.node.addEventListener('load', this.handleSuccess);
    this.node.addEventListener('error', this.handleError);
  }

  /**
   * Remove events from iframe
   * @private
   */
  removeEvents() {
    this.node.removeEventListener('load', this.handleSuccess);
    this.node.removeEventListener('error', this.handleError);
    this.events.removeAllListeners();
  }

  onSuccess() {
    this.events.emit('success');
  }

  onError() {
    this.events.emit('error');
  }

  /**
   * Append field in some DOM node
   * @param {HTMLElement} node
   */
  appendTo(node) {
    /**
     * @type {HTMLElement}
     */
    this.parent = node;
    node.appendChild(this.node);
  }

  /**
   * Remove iframe node from parent, if it is
   */
  destroy() {
    if (this.parent) {
      this.parent.removeChild(this.node);
    }
    this.removeEvents();
    this.node = null;
    this.parent = null;
  }
}

export default IFrame;
export {
  IFrame,
};
