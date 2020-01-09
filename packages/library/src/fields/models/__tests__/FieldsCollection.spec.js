import { FieldModel } from '../FieldModel';
import { FieldsCollection } from '../FieldsCollection';

describe('FieldsCollection', () => {
  describe('#addField', () => {
    let fieldsCollection;
    let field;

    beforeEach(() => {
      fieldsCollection = new FieldsCollection();
      field = new FieldModel();

      fieldsCollection.addField(field);
    });

    it('should add field', () => {
      expect(fieldsCollection.fields[field.id]).toBe(field);
    });
  });

  describe('#removeField', () => {
    let fieldsCollection;
    let firstField;
    let secondField;

    beforeEach(() => {
      fieldsCollection = new FieldsCollection();
      firstField = new FieldModel();
      secondField = new FieldModel();

      fieldsCollection.addField(firstField);
      fieldsCollection.addField(secondField);
    });

    it('should remove field', () => {
      fieldsCollection.removeField(firstField);

      expect(fieldsCollection.fields).toEqual({
        [secondField.id]: secondField,
      });
    });
  });

  describe('#getField', () => {
    it('should get field by id', () => {
      const field = new FieldModel();
      const fieldsCollection = new FieldsCollection();
      fieldsCollection.addField(field);

      expect(fieldsCollection.getField(field.id)).toBe(field);
    });

    it('should get null, if field is not found', () => {
      const fieldsCollection = new FieldsCollection();

      expect(fieldsCollection.getField('some-field-id')).toBe(null);
    });
  });

  describe('#setFieldsStatus', () => {
    let fieldsCollection;
    let field;

    beforeEach(() => {
      fieldsCollection = new FieldsCollection();
      field = new FieldModel();

      fieldsCollection.addField(field);
    });

    it('should set field status, if field exists', () => {
      fieldsCollection.setFieldStatus({ fieldId: field.id, status: FieldModel.STATUSES.LOADING });

      expect(field.status).toBe(FieldModel.STATUSES.LOADING);
    });

    it('should not throw error, if field does not exists', () => {
      expect(() => {
        fieldsCollection.setFieldStatus({ fieldId: 'unknown-id', status: FieldModel.STATUSES.LOADING });
      }).not.toThrowError();
    });

    it('should do nothing, if field does not exists', () => {
      const initialFieldsStatuses = Object.values(fieldsCollection.fields).map((f) => f.status);

      fieldsCollection.setFieldStatus({ fieldId: 'unknown-id', status: FieldModel.STATUSES.LOADING });
      const resultsFieldsStatuses = Object.values(fieldsCollection.fields).map((f) => f.status);

      expect(initialFieldsStatuses).toEqual(resultsFieldsStatuses);
    });
  });
});
