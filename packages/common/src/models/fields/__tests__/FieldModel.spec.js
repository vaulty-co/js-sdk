import { FieldModel } from '../FieldModel';
import {
  FIELD_CONTENT_STATUSES,
  FIELD_NODE_STATUSES,
  FIELD_VALIDATION_STATUSES,
  FIELD_READINESS_STATUSES, FIELD_FOCUS_STATUSES,
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

      expect(field.status).toEqual({
        node: FIELD_NODE_STATUSES.UNMOUNTED,
        content: FIELD_CONTENT_STATUSES.EMPTY,
        validation: {
          status: FIELD_VALIDATION_STATUSES.UNKNOWN,
          invalidValidators: [],
        },
        readiness: FIELD_READINESS_STATUSES.LOADING,
        focus: FIELD_FOCUS_STATUSES.UNFOCUSED,
      });
    });
  });
});
