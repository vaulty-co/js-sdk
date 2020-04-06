import { CONTROLLER_VALIDATION_STATUSES } from '../constants';
import { ControllersCollection } from '../ControllersCollection';
import { ControllerModel } from '../ControllerModel';

describe('ControllersCollection', () => {
  let controllersCollection;
  let firstController;
  let secondController;

  beforeEach(() => {
    controllersCollection = new ControllersCollection();
    firstController = new ControllerModel();
    secondController = new ControllerModel();
  });

  describe('#addController', () => {
    it('should add controller', () => {
      controllersCollection.addController(firstController);

      expect(controllersCollection.controllers[firstController.id]).toBe(firstController);
    });
  });

  describe('#removeController', () => {
    it('should remove controller', () => {
      controllersCollection.addController(firstController);
      controllersCollection.addController(secondController);

      controllersCollection.removeController(firstController);

      expect(controllersCollection.controllers).toEqual({
        [secondController.id]: secondController,
      });
    });
  });

  describe('#getController', () => {
    beforeEach(() => {
      controllersCollection.addController(firstController);
    });

    it('should return controller by its id, if it exists', () => {
      const actualController = controllersCollection.getController(firstController.id);

      expect(actualController).toBe(firstController);
    });

    it('should return null, when contoller does not exist', () => {
      const actualController = controllersCollection.getController('non-exist-controller');

      expect(actualController).toBe(null);
    });
  });

  describe('#addFieldsToController', () => {
    beforeEach(() => {
      controllersCollection.addController(firstController);
    });

    it('should call controller addFields method, if it exists', () => {
      jest.spyOn(firstController, 'addFields').mockImplementation(() => {});
      controllersCollection.addFieldsToController({
        controllerId: firstController.id,
        fieldsIds: ['field-1', 'field-2'],
      });

      expect(firstController.addFields).toBeCalledWith(['field-1', 'field-2']);
      firstController.addFields.mockReset();
    });

    it('should work ok, when controller does not exist', () => {
      expect(() => {
        controllersCollection.addFieldsToController({
          controllerId: 'non-exist-controller',
          fieldsIds: ['field-1', 'field-2'],
        });
      }).not.toThrowError();
    });
  });

  describe('#removeFieldsFromController', () => {
    beforeEach(() => {
      controllersCollection.addController(firstController);
    });

    it('should call controller removeFields method, if it exists', () => {
      jest.spyOn(firstController, 'removeFields').mockImplementation(() => {});
      controllersCollection.removeFieldsFromController({
        controllerId: firstController.id,
        fieldsIds: ['field-1', 'field-2'],
      });

      expect(firstController.removeFields).toBeCalledWith(['field-1', 'field-2']);
      firstController.removeFields.mockReset();
    });

    it('should work ok, when controller does not exist', () => {
      expect(() => {
        controllersCollection.removeFieldsFromController({
          controllerId: 'non-exist-controller',
          fieldsIds: ['field-1', 'field-2'],
        });
      }).not.toThrowError();
    });
  });

  describe('#setControllerStatus', () => {
    beforeEach(() => {
      controllersCollection.addController(firstController);
    });

    it('should call controller setStatus method, if it exists', () => {
      jest.spyOn(firstController, 'setStatus').mockImplementation(() => {});
      controllersCollection.setControllerStatus({
        controllerId: firstController.id,
        status: {
          validation: CONTROLLER_VALIDATION_STATUSES.VALID,
        },
      });

      expect(firstController.setStatus).toBeCalledWith({
        validation: CONTROLLER_VALIDATION_STATUSES.VALID,
      });
      firstController.setStatus.mockReset();
    });

    it('should work ok, when controller does not exist', () => {
      expect(() => {
        controllersCollection.removeFieldsFromController({
          controllerId: 'non-exist-controller',
          fieldsIds: ['field-1', 'field-2'],
        });
      }).not.toThrowError();
    });
  });
});
