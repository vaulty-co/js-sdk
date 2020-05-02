import { createSelectorCreator, defaultMemoize } from 'reselect';
import shallowEqual from 'shallowequal';

const createShallowEqualSelector = createSelectorCreator(defaultMemoize, shallowEqual);

export default {
  createShallowEqualSelector,
};
export {
  createShallowEqualSelector,
};
