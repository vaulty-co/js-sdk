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
   * @param {string} path
   * @param {FormSubmitOptions} options
   */
  submit(path, options) {
    return this.controller.submit(path, options);
  }
}

export default FormProxy;
export {
  FormProxy,
};
