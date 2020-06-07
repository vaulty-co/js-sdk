import { uniqueId } from '@vaulty/common/src/helpers/uniqueId';

import {
  CONTROLLER_NODE_STATUSES,
  CONTROLLER_READINESS_STATUSES,
  CONTROLLER_VALIDATION_STATUSES,
} from '../constants';
import { ControllerModel } from '../ControllerModel';

jest.mock('@vaulty/common/src/helpers/uniqueId', () => {
  const { uniqueId: uniqueIdActual } = jest.requireActual('@vaulty/common/src/helpers/uniqueId');
  return {
    uniqueId: jest.fn(uniqueIdActual),
  };
});

describe('ControllerModel', () => {
  let controllerModel;

  beforeEach(() => {
    controllerModel = new ControllerModel({
      fieldsIds: ['field-1', 'field-2'],
    });
  });

  afterEach(() => {
    const { uniqueId: uniqueIdActual } = jest.requireActual('@vaulty/common/src/helpers/uniqueId');
    uniqueId.mockImplementation(uniqueIdActual);
  });

  describe('#constructor', () => {
    it('should create model with specified fieldsIds', () => {
      expect(controllerModel.fieldsIds).toEqual(['field-1', 'field-2']);
    });

    it('should set empty fieldsIds if it is not specified', () => {
      controllerModel = new ControllerModel();

      expect(controllerModel.fieldsIds).toEqual([]);
    });

    it('should setup initial status', () => {
      expect(controllerModel.status).toMatchSnapshot();
    });
  });

  describe('#addFields', () => {
    it('should add array of fields ids', () => {
      controllerModel.addFields(['field-3', 'field-4']);

      expect(controllerModel.fieldsIds).toEqual(['field-1', 'field-2', 'field-3', 'field-4']);
    });
  });

  describe('#removeFields', () => {
    it('should remove fields ids', () => {
      controllerModel.addFields(['field-3', 'field-4']);

      controllerModel.removeFields(['field-3', 'field-4']);

      expect(controllerModel.fieldsIds).toEqual(['field-1', 'field-2']);
    });
  });

  describe('#setStatus', () => {
    it('should set status with merging with previous', () => {
      controllerModel.setStatus({
        node: CONTROLLER_NODE_STATUSES.MOUNTED,
        validation: CONTROLLER_VALIDATION_STATUSES.VALID,
        readiness: CONTROLLER_READINESS_STATUSES.READY,
      });

      controllerModel.setStatus({
        validation: CONTROLLER_VALIDATION_STATUSES.INVALID,
      });

      expect(controllerModel.status).toMatchSnapshot();
    });
  });
});
