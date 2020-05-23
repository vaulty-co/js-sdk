import { IFrameNode } from '@js-sdk/common/src/nodes/IFrameNode';
import { queryString } from '@js-sdk/elements/src/controllers/instances/Form/route/queryString';
import {
  CONTROLLER_STATUSES,
} from '@js-sdk/common/src/models/controllers/constants';
import { staticInvariant } from '@js-sdk/common/src/helpers/invariant';

import { configSelector } from '../../../store/config/selectors';
import { Controller } from '../../common/Controller';
import { makeControllerParamsSelector } from '../../common/store/selectors';
import { operationSubmitForm } from './operations/submitForm';

/**
 * @class SDKForm
 * @extends SDKController
 */
class Form extends Controller {
  static get STATUSES() {
    return CONTROLLER_STATUSES;
  }

  static get invariant() {
    return staticInvariant;
  }

  /**
   * @param {SDKFormOptions} options
   */
  constructor(options) {
    super(options);

    this.operations.submitForm = (...args) => (
      this.options.store.dispatch(
        operationSubmitForm(...args),
      )
    );

    const state = options.store.getState();
    const config = configSelector(state);
    const controllerParams = makeControllerParamsSelector(this.id)(state);
    this.controllerIframe = new IFrameNode({
      width: 0,
      height: 0,
      src: `${config.elementsOrigin}/?${queryString}&${controllerParams}`,
    });
    this.appendTo(document.body);
  }

  /**
   * Submit form in options specified URL
   * @param {string} path
   * @param {FormSubmitOptions} [options = {}]
   */
  submit(path, options = {}) {
    this.constructor.invariant(
      Boolean(path),
      'Option "path" is required for submitting form',
    );

    this.operations.submitForm(
      {
        id: this.id,
        path,
        options,
      },
      () => {
        this.events.emit('submit', { success: true });
      },
      (error) => {
        this.events.emit('submit', error);
      },
    );
  }
}

export default Form;
export {
  Form,
};
