import { BroadcastChannel } from 'broadcast-channel';

import { Message } from './Message';
import { isSafari } from '../helpers/isSafari';

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

/**
 * Create broadcast channel
 * @param {string} channelId
 * @return {BroadcastChannel}
 */
function createBroadcastChannel(channelId) {
  let broadcastChannelOptions = {};
  // Notice: Safari does not allow IndexDB fallback in iFrame and we should manually
  // use localStorage
  if (isSafari()) {
    broadcastChannelOptions = {
      type: 'localstorage',
    };
  }

  return new BroadcastChannel(
    channelId,
    broadcastChannelOptions,
  );
}

export {
  createMessageChannel,
  createMessagePortHandler,
  createBroadcastChannel,
};
