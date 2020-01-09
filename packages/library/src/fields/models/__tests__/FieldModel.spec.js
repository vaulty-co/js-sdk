import { FieldModel } from '../FieldModel';

describe('FieldModel', () => {
  describe('#constructor', () => {
    it('should work fine, when options is not specified', () => {
      expect(() => {
        new FieldModel();
      }).not.toThrowError();
    });

    it('should setup type as "unknown", if it is not specified', () => {
      const field = new FieldModel({});

      expect(field.type).toBe('unknown');
    });
  });

  describe('#setStatus', () => {
    it('should set status to field', () => {
      const field = new FieldModel();

      field.setStatus(FieldModel.STATUSES.LOADING);

      expect(field.status).toBe(FieldModel.STATUSES.LOADING);
    });
  });
});
