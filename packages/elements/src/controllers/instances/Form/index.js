import { Controller } from '../../common/Controller';
import {
  SUBMIT_REQUEST,
} from './messages';
import { submitHandler } from './handlers/submit';

/**
 * Form controller for submitting data from fields
 */
class Form extends Controller {
  /**
   * Register allowed messages by master frame and give response by this messages
   * @protected
   */
  registerHandlers() {
    super.registerHandlers();

    this.controllerSlaveChannel.subscribe(SUBMIT_REQUEST, submitHandler.bind(this));
  }
}

export default Form;
export {
  Form,
};
