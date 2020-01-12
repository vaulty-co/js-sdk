const MESSAGE_CLASS_IDENTIFIER = '__$$message';

/**
 * @class
 */
class Message {
  /**
   * Convert some data in message instance
   * @param {*} data
   * @return {?Message}
   */
  static of(data) {
    if (typeof data !== 'string') {
      return null;
    }
    try {
      const obj = JSON.parse(data);
      if (obj[MESSAGE_CLASS_IDENTIFIER]) {
        return new Message(obj.type, obj.payload, obj.meta);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Clone message with possibility to change payload data
   * @param {Message} message
   * @param {Object} [payload={}]
   */
  static clone(message, payload = {}) {
    return new Message(message.type, payload, message.meta);
  }

  /**
   * @param {string} type
   * @param {Object} [payload = {}]
   * @param {Object} [meta = {}]
   */
  constructor(type, payload = {}, meta = {}) {
    this.type = type;
    this.payload = payload;
    this.meta = meta;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'string') {
      return JSON.stringify({
        type: this.type,
        payload: this.payload,
        meta: this.meta,
        [MESSAGE_CLASS_IDENTIFIER]: true,
      });
    }
    return null;
  }
}

export default Message;
export {
  Message,
};
