import thunk from 'redux-thunk';

import { Channels } from '../../utils/Channels';

const operationsMiddleware = (store) => {
  const channels = new Channels(store);
  return thunk.withExtraArgument(channels)(store);
};

export default {
  operationsMiddleware,
};
export {
  operationsMiddleware,
};
