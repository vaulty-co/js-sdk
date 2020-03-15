import { FieldsCollection } from '@js-sdk/library/src/fields/models/FieldsCollection';
import { FieldModel } from '@js-sdk/library/src/fields/models/FieldModel';
import {
  FIELD_READINESS_STATUSES,
  FIELD_VALIDATION_STATUSES,
} from '@js-sdk/library/src/fields/constants';
import { uniqueId } from '@js-sdk/common/src/helpers/uniqueId';

import {
  CONTROLLER_NODE_STATUSES,
  CONTROLLER_READINESS_STATUSES,
  CONTROLLER_VALIDATION_STATUSES,
} from '../../constants';
import { ControllerModel } from '../ControllerModel';

jest.mock('@js-sdk/common/src/helpers/uniqueId', () => {
  const { uniqueId: uniqueIdActual } = jest.requireActual('@js-sdk/common/src/helpers/uniqueId');
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
    const { uniqueId: uniqueIdActual } = jest.requireActual('@js-sdk/common/src/helpers/uniqueId');
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

  describe('#getFormStatusByFields', () => {
    let fieldsCollection;
    let field1;
    let field2;

    beforeEach(() => {
      fieldsCollection = new FieldsCollection();
      uniqueId.mockImplementation(() => 'field-1');
      field1 = new FieldModel();
      field1.setStatus({
        readiness: FIELD_READINESS_STATUSES.READY,
        validation: {
          status: FIELD_VALIDATION_STATUSES.VALID,
        },
      });
      uniqueId.mockImplementation(() => 'field-2');
      field2 = new FieldModel();
      field2.setStatus({
        readiness: FIELD_READINESS_STATUSES.READY,
        validation: {
          status: FIELD_VALIDATION_STATUSES.VALID,
        },
      });

      fieldsCollection.addField(field1);
      fieldsCollection.addField(field2);
    });

    it('should return readiness of form as LOADING, when one of fields is loading', () => {
      field1 = field1.setStatus({
        readiness: FIELD_READINESS_STATUSES.LOADING,
      });
      field2 = field2.setStatus({
        readiness: FIELD_READINESS_STATUSES.READY,
      });

      const actualResult = controllerModel.getFormStatusByFields(fieldsCollection);

      expect(actualResult.readiness).toBe(CONTROLLER_READINESS_STATUSES.LOADING);
    });

    it('should return readiness of form as READY, when all fields are ready', () => {
      field1 = field1.setStatus({
        readiness: FIELD_READINESS_STATUSES.READY,
      });
      field2 = field2.setStatus({
        readiness: FIELD_READINESS_STATUSES.READY,
      });

      const actualResult = controllerModel.getFormStatusByFields(fieldsCollection);

      expect(actualResult.readiness).toBe(CONTROLLER_READINESS_STATUSES.READY);
    });

    it('should return validation of form as INVALID, when one of fields are invalid', () => {
      field1 = field1.setStatus({
        validation: {
          status: FIELD_VALIDATION_STATUSES.INVALID,
        },
      });
      field2 = field2.setStatus({
        validation: {
          status: FIELD_VALIDATION_STATUSES.VALID,
        },
      });

      const actualResult = controllerModel.getFormStatusByFields(fieldsCollection);

      expect(actualResult.validation).toBe(CONTROLLER_VALIDATION_STATUSES.INVALID);
    });

    it('should return validation of form as VALID, when all fields are valid', () => {
      field1 = field1.setStatus({
        validation: {
          status: FIELD_VALIDATION_STATUSES.VALID,
        },
      });
      field2 = field2.setStatus({
        validation: {
          status: FIELD_VALIDATION_STATUSES.VALID,
        },
      });

      const actualResult = controllerModel.getFormStatusByFields(fieldsCollection);

      expect(actualResult.validation).toBe(CONTROLLER_VALIDATION_STATUSES.VALID);
    });

    it('should return full form state computed by fields', () => {
      const actualResult = controllerModel.getFormStatusByFields(fieldsCollection);

      expect(actualResult).toMatchSnapshot();
    });

    it('should return memoized result, when fields collection is not changed', () => {
      const previousResult = controllerModel.getFormStatusByFields(fieldsCollection);

      const actualResult = controllerModel.getFormStatusByFields(fieldsCollection);

      expect(actualResult).toBe(previousResult);
    });

    it('should return memoized result, when fields collection are changed but fields not', () => {
      const previousResult = controllerModel.getFormStatusByFields(fieldsCollection);
      uniqueId.mockImplementation(() => 'field-3');
      const field3 = new FieldModel();
      const newFieldsCollection = new FieldsCollection();
      newFieldsCollection.addField(field1);
      newFieldsCollection.addField(field2);
      newFieldsCollection.addField(field3);

      const actualResult = controllerModel.getFormStatusByFields(newFieldsCollection);

      expect(actualResult).toBe(previousResult);
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
