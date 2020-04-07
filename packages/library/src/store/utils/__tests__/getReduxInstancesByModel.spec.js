import { getReduxInstancesByModel } from '../getReduxInstancesByModel';

describe('getReduxInstancesByModel', () => {
  class Model {
    constructor() {
      this.items = {};
    }

    addItem(item) {
      this.items[item.id] = item;
    }

    removeItem(item) {
      delete this.items[item.id];
    }
  }

  it('should create actions by models methods', () => {
    // Arrange
    const { actions } = getReduxInstancesByModel(Model, ['addItem'], new Model());

    // Act
    const addItemAction = actions.addItem({ id: 'item-id' });

    // Assert
    expect(addItemAction).toMatchObject({
      type: 'addItem',
      payload: { id: 'item-id' },
    });
  });

  it('should not create actions for methods, which are not specified in list', () => {
    // Arrange
    const { actions } = getReduxInstancesByModel(Model, ['addItem'], new Model());

    // Assert
    expect(actions).not.toHaveProperty('removeItem');
  });

  it('should throw error, when methods do not exist in model', () => {
    // Act
    const throwError = () => (
      getReduxInstancesByModel(Model, ['someNonExistMethod'], new Model())
    );

    // Assert
    expect(throwError).toThrowErrorMatchingSnapshot();
  });

  it('should create reducer by models method, which call model method by action', () => {
    // Arrange
    const { actions, reducer } = getReduxInstancesByModel(Model, ['addItem'], new Model());
    const item = { id: 'item-id' };

    // Act
    const expectedResult = reducer(new Model(), actions.addItem(item));

    // Assert
    expect(expectedResult.items['item-id']).toBe(item);
  });

  it('should use provided model instance as initial state', () => {
    // Arrange
    const initialState = new Model();
    const { reducer } = getReduxInstancesByModel(Model, ['addItem'], initialState);

    // Act
    const expectedResult = reducer(undefined, { type: 'unknownAction' });

    // Assert
    expect(expectedResult).toBe(initialState);
  });
});
