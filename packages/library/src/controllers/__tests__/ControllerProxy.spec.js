import { getMethods } from '../../helpers/getMethods';
import { createStore } from '../../store';
import { Controller } from '../common/Controller';
import { DestroyedController } from '../common/DestroyedController';
import { ControllerProxy, CONTROLLER_TYPES } from '../ControllerProxy';

describe('ControllerProxy', () => {
  it('should have the same methods that controller', () => {
    expect(getMethods(ControllerProxy.prototype))
      .toEqual(getMethods(Controller.prototype));
  });

  it('should have the same methods that destroyed controller', () => {
    expect(getMethods(ControllerProxy.prototype))
      .toEqual(getMethods(DestroyedController.prototype));
  });

  Object.keys(CONTROLLER_TYPES).forEach((controllerType) => {
    it(`should create controller by ${controllerType} type`, () => {
      const controllerProxy = new ControllerProxy(controllerType, {
        store: createStore(),
      });

      expect(controllerProxy.controller).toBeInstanceOf(CONTROLLER_TYPES[controllerType]);
    });
  });

  describe('should control destroying controller', () => {
    let controllerProxy;
    let unsubscribe;

    beforeEach(() => {
      CONTROLLER_TYPES.someForm = function () {};
      unsubscribe = jest.fn();
      const mockStore = {
        subscribers: [],
        getState: jest.fn(),
        subscribe(callback) {
          this.subscribers.push(callback);
          return unsubscribe;
        },
        dispatch: jest.fn(),
      };
      controllerProxy = new ControllerProxy('someForm', {
        store: mockStore,
      });
      controllerProxy.controllerSelector = jest.fn(() => null);

      mockStore.subscribers.forEach((callback) => callback());
    });

    afterEach(() => {
      controllerProxy = null;
      delete CONTROLLER_TYPES.someForm;
    });

    it('should replace controller by destroyed controller, when controller is destroyed', () => {
      expect(controllerProxy.controller).toBeInstanceOf(DestroyedController);
    });

    it('should unsubscribe from store', () => {
      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe('should proxy all arguments to method', () => {
    const methods = getMethods(Controller.prototype, 1)
      .filter((controllerMethod) => !['constructor'].includes(controllerMethod));

    beforeEach(() => {
      class SomeForm {}
      methods.forEach(
        (controllerMethod) => {
          SomeForm.prototype[controllerMethod] = jest.fn();
        },
      );
      CONTROLLER_TYPES.someForm = SomeForm;
    });

    methods.forEach((controllerMethod) => {
      it(`should proxy arguments to controller method ${controllerMethod}`, () => {
        const args = Array.from(Controller.prototype[controllerMethod], (_, x) => x);
        const controllerProxy = new ControllerProxy('someForm', {
          store: createStore(),
        });

        controllerProxy[controllerMethod](...args);

        expect(controllerProxy.controller[controllerMethod]).toHaveBeenCalledWith(...args);
      });
    });
  });
});
