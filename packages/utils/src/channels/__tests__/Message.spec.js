import { Message } from '../Message';

describe('Message', () => {
  describe('@of', () => {
    it('should convert stringified object with message class identifier to message', () => {
      const message = new Message('some_message', {});

      expect(Message.of(`${message}`)).toEqual(message);
    });

    it('should return null for stringified object without message class identifier', () => {
      const message = JSON.stringify({ type: 'some_message', payload: {} });

      expect(Message.of(message)).toBe(null);
    });

    it('should return null for other strings', () => {
      const message = 'some_message';

      expect(Message.of(message)).toBe(null);
    });

    it('should return null for non string data', () => {
      const message = {};

      expect(Message.of(message)).toBe(null);
    });
  });

  describe('#constructor', () => {
    it('should create empty payload, when it is not provided', () => {
      const message = new Message('some_message');

      expect(message.payload).toEqual({});
    });

    it('should create empty meta, when it is not provided', () => {
      const message = new Message('some_message');

      expect(message.meta).toEqual({});
    });

    it('should use provided payload', () => {
      const payload = { somePayload: true };
      const message = new Message('some_message', payload);

      expect(message.payload).toBe(payload);
    });

    it('should use provided meta', () => {
      const meta = { someMeta: true };
      const message = new Message('some_message', {}, meta);

      expect(message.meta).toBe(meta);
    });
  });

  describe('#toString', () => {
    it('should convert message in string, which can be used in Message.of method', () => {
      const message = new Message('some_message', {});

      expect(Message.of(message.toString())).toEqual(message);
    });
  });

  describe('Symbol.toPrimitive', () => {
    it('should convert message in string, which it is used in string primitive', () => {
      const message = new Message('some_message', {});

      expect(`${message}`).toEqual(message.toString());
    });

    it('should convert message in null, which it is used as non string primitive', () => {
      const message = new Message('some_message', {});

      expect(message - 1).toEqual(-1);
    });
  });
});
