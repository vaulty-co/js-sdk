import { ControllerProxy } from './ControllerProxy';

class FormProxy extends ControllerProxy {
  /**
   * @param {SDKFormOptions} options
   */
  constructor(options) {
    super('form', options);
  }

  /**
   * Submit form in options specified URL
   * @param {FormSubmitOptions} options
   */
  submit(options) {
    return this.controller.submit(options);
  }
}

export default FormProxy;
export {
  FormProxy,
};
