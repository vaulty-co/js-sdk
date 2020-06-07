import { FieldsCollection } from '@vaulty/common/src/models/fields/FieldsCollection';
import { FieldModel } from '@vaulty/common/src/models/fields/FieldModel';
import { ControllersCollection } from '@vaulty/common/src/models/controllers/ControllersCollection';
import { ControllerModel } from '@vaulty/common/src/models/controllers/ControllerModel';

import { makeControllerStatusSelector } from '../selectors';

describe('makeControllerStatusSelector', () => {
  let fields;
  let field1;
  let field2;
  let controller;
  let state;

  beforeEach(() => {
    field1 = new FieldModel({
      id: 'field-1',
    });
    field1.setStatus({
      readiness: FieldModel.STATUSES.READINESS.READY,
      validation: {
        status: FieldModel.STATUSES.VALIDATION.VALID,
      },
    });
    field2 = new FieldModel({
      id: 'field-2',
    });
    field2.setStatus({
      readiness: FieldModel.STATUSES.READINESS.READY,
      validation: {
        status: FieldModel.STATUSES.VALIDATION.VALID,
      },
    });
    fields = new FieldsCollection();
    fields.addField(field1);
    fields.addField(field2);

    controller = new ControllerModel({
      id: 'controller-1',
      fieldsIds: ['field-1', 'field-2'],
      status: {
        ...ControllerModel.STATUSES.INITIAL,
        readiness: ControllerModel.STATUSES.READINESS.READY,
      },
    });
    const controllers = new ControllersCollection();
    controllers.addController(controller);
    state = {
      controllers,
      fields,
    };
  });

  it('should return readiness of form as LOADING, when one of fields is loading', () => {
    field1 = field1.setStatus({
      readiness: FieldModel.STATUSES.READINESS.LOADING,
    });
    field2 = field2.setStatus({
      readiness: FieldModel.STATUSES.READINESS.READY,
    });

    const actualResult = makeControllerStatusSelector('controller-1')(state);

    expect(actualResult.readiness).toBe(ControllerModel.STATUSES.READINESS.LOADING);
  });

  it('should return readiness of form as READY, when all fields are ready', () => {
    field1 = field1.setStatus({
      readiness: FieldModel.STATUSES.READINESS.READY,
    });
    field2 = field2.setStatus({
      readiness: FieldModel.STATUSES.READINESS.READY,
    });

    const actualResult = makeControllerStatusSelector('controller-1')(state);

    expect(actualResult.readiness).toBe(ControllerModel.STATUSES.READINESS.READY);
  });

  it('should return readiness of form as LOADING, when all fields are ready, but controller is not', () => {
    field1 = field1.setStatus({
      readiness: FieldModel.STATUSES.READINESS.READY,
    });
    field2 = field2.setStatus({
      readiness: FieldModel.STATUSES.READINESS.READY,
    });
    controller.setStatus({
      readiness: ControllerModel.STATUSES.READINESS.LOADING,
    });

    const actualResult = makeControllerStatusSelector('controller-1')(state);

    expect(actualResult.readiness).toBe(ControllerModel.STATUSES.READINESS.LOADING);
  });

  it('should return validation of form as INVALID, when one of fields are invalid', () => {
    field1 = field1.setStatus({
      validation: {
        status: FieldModel.STATUSES.VALIDATION.INVALID,
      },
    });
    field2 = field2.setStatus({
      validation: {
        status: FieldModel.STATUSES.VALIDATION.VALID,
      },
    });

    const actualResult = makeControllerStatusSelector('controller-1')(state);

    expect(actualResult.validation).toBe(ControllerModel.STATUSES.VALIDATION.INVALID);
  });

  it('should return validation of form as VALID, when all fields are valid', () => {
    field1 = field1.setStatus({
      validation: {
        status: FieldModel.STATUSES.VALIDATION.VALID,
      },
    });
    field2 = field2.setStatus({
      validation: {
        status: FieldModel.STATUSES.VALIDATION.VALID,
      },
    });

    const actualResult = makeControllerStatusSelector('controller-1')(state);

    expect(actualResult.validation).toBe(ControllerModel.STATUSES.VALIDATION.VALID);
  });

  it('should return node status of controller', () => {
    const actualResult = makeControllerStatusSelector('controller-1')(state);

    expect(actualResult.node).toBe(ControllerModel.STATUSES.NODE.UNMOUNTED);
  });
});
