import { IFrameNode } from '@js-sdk/common/src/nodes/IFrameNode';
import { queryString } from '@js-sdk/elements/src/controllers/instances/Form/route/queryString';
import {
  CONTROLLER_STATUSES,
} from '@js-sdk/common/src/models/controllers/constants';

import { Config } from '../../../config';
import { Controller } from '../../common/Controller';
import { makeControllerParamsSelector } from '../../common/store/selectors';
import { operationSubmitForm } from './operations/submitForm';

/**
 * @class
 */
class Form extends Controller {
  static get STATUSES() {
    return CONTROLLER_STATUSES;
  }

  /**
   * @param {FormOptions} options
   */
  constructor(options) {
    super(options);

    this.operations.submitForm = (...args) => (
      this.options.store.dispatch(
        operationSubmitForm(...args),
      )
    );

    const state = options.store.getState();
    const controllerParams = makeControllerParamsSelector(this.id)(state);
    this.controllerIframe = new IFrameNode({
      width: 0,
      height: 0,
      src: `${Config.elementsOrigin}/?${queryString}&${controllerParams}`,
    });
    this.appendTo(document.body);
  }

  /**
   * Submit form in options specified URL
   * @param {FormSubmitOptions} options
   */
  submit(options) {
    this.operations.submitForm(
      { id: this.id, options },
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
