import { immerable } from 'immer';

class ConfigModel {
  constructor() {
    this[immerable] = true;
  }

  addConfig(data) {
    Object.assign(this, data);
  }
}

export default ConfigModel;
export {
  ConfigModel,
};
