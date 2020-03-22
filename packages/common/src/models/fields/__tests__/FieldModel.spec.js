import { FieldModel } from '../FieldModel';
import {
  FIELD_READINESS_STATUSES,
} from '../constants';

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
    it('should set status to with replacing only set statuses', () => {
      const field = new FieldModel();

      field.setStatus({
        readiness: FIELD_READINESS_STATUSES.LOADING,
      });

      expect(field.status).toMatchSnapshot();
    });
  });
});
