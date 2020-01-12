const CHANNEL_STATUSES = {
  INITIALIZED: 'initialized',
  OPENED: 'opened',
  EXECUTING: 'executing',
  CLOSED: 'closed',
  DESTROYED: 'destroyed',
};

const PING_MESSAGE_TYPE = '__$$PING_MESSAGE';
const PONG_MESSAGE_TYPE = '__$$PONG_MESSAGE';

const DOCUMENT_READY_STATES = {
  LOADING: 'loading',
  INTERACTIVE: 'interactive',
  COMPLETE: 'complete',
};

export {
  CHANNEL_STATUSES,
  PING_MESSAGE_TYPE,
  PONG_MESSAGE_TYPE,
  DOCUMENT_READY_STATES,
};
