import thunk from 'redux-thunk';

import { Channels } from '../../utils/Channels';

const channels = new Channels();
const operationsMiddleware = thunk.withExtraArgument(channels);

export {
  operationsMiddleware,
  channels,
};
