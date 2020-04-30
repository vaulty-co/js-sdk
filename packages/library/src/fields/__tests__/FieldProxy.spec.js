import { getMethods } from '../../helpers/getMethods';
import { createStore } from '../../store';
import { Field } from '../common/Field';
import { DestroyedField } from '../common/DestroyedField';
import { FieldProxy, FIELD_TYPES } from '../FieldProxy';

describe('FieldProxy', () => {
  it('should have the same methods that field', () => {
    expect(getMethods(FieldProxy.prototype)).toEqual(getMethods(Field.prototype));
  });

  it('should have the same methods that destroyed field', () => {
    expect(getMethods(FieldProxy.prototype)).toEqual(getMethods(DestroyedField.prototype));
  });

  Object.keys(FIELD_TYPES).forEach((fieldType) => {
    it(`should create field by ${fieldType} type`, () => {
      const fieldProxy = new FieldProxy(fieldType, {
        store: createStore(),
      });

      expect(fieldProxy.field).toBeInstanceOf(FIELD_TYPES[fieldType]);
    });
  });

  describe('should control destroying field', () => {
    let fieldProxy;
    let unsubscribe;

    beforeEach(() => {
      FIELD_TYPES.someInput = function () {};
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
      fieldProxy = new FieldProxy('someInput', {
        store: mockStore,
      });
      fieldProxy.fieldSelector = jest.fn(() => null);

      mockStore.subscribers.forEach((callback) => callback());
    });

    afterEach(() => {
      fieldProxy = null;
      delete FIELD_TYPES.someInput;
    });

    it('should replace field by destroyed field, when field is destroyed', () => {
      expect(fieldProxy.field).toBeInstanceOf(DestroyedField);
    });

    it('should unsubscribe from store', () => {
      expect(unsubscribe).toHaveBeenCalled();
    });
  });

  describe('should proxy all arguments to method', () => {
    const methods = getMethods(Field.prototype, 1)
      .filter((fieldMethod) => !['constructor'].includes(fieldMethod));

    beforeEach(() => {
      class SomeInput {}
      methods.forEach(
        (fieldMethod) => {
          SomeInput.prototype[fieldMethod] = jest.fn();
        },
      );
      FIELD_TYPES.someInput = SomeInput;
    });

    methods.forEach((fieldMethod) => {
      it(`should proxy arguments to field method ${fieldMethod}`, () => {
        const args = Array.from(Field.prototype[fieldMethod], (_, x) => x);
        const fieldProxy = new FieldProxy('someInput', {
          store: createStore(),
        });

        fieldProxy[fieldMethod](...args);

        expect(fieldProxy.field[fieldMethod]).toHaveBeenCalledWith(...args);
      });
    });
  });
});
