import { Message } from './Message';

/**
 * Create message channel
 * @return {MessageChannel}
 */
const createMessageChannel = () => (
  new MessageChannel()
);

/**
 * Create message handler for port
 * @param {function(message: Message, event: MessageEvent)} callback
 * @return {function(event: MessageEvent)}
 */
function createMessagePortHandler(callback) {
  return function messagePortHandler(event) {
    const message = Message.of(event.data);
    if (message) {
      callback(message, event);
    }
  };
}

export {
  createMessageChannel,
  createMessagePortHandler,
};
