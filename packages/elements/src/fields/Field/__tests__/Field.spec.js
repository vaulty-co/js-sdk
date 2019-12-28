import { Field } from '../index';

describe('Field', () => {
  describe('#constructor', () => {
    it('should throw error, when node is not HTMLELement', () => {
      const fieldNode = {};

      expect(() => {
        new Field(fieldNode);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#appendTo', () => {
    it('should append field node in specified parent node', () => {
      const fieldNode = document.createElement('div');
      const parentNode = document.createElement('div');
      const field = new Field(fieldNode);

      field.appendTo(parentNode);

      expect(parentNode.firstChild).toBe(fieldNode);
    });

    it('should throw error, when parent node is not HTMLElement', () => {
      const fieldNode = document.createElement('div');
      const parentNode = undefined;
      const field = new Field(fieldNode);

      expect(() => {
        field.appendTo(parentNode);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#destroy', () => {
    let fieldNode;
    let parentNode;
    let field;

    beforeEach(() => {
      fieldNode = document.createElement('div');
      parentNode = document.createElement('div');
      field = new Field(fieldNode);

      field.appendTo(parentNode);
    });

    it('should remove node from parent, if field has been appended to its', () => {
      field.destroy();

      expect(parentNode.firstChild).toBe(null);
    });

    it('should clear all references about nodes (parent and field node)', () => {
      field.destroy();

      expect(field.node).toBe(null);
      expect(field.parent).toBe(null);
    });

    it('should throw exception when appendTo is called after destroying', () => {
      field.destroy();

      expect(() => {
        field.appendTo(parentNode);
      }).toThrowErrorMatchingSnapshot();
    });

    it('should throw exception when destroy is called after destroying', () => {
      field.destroy();

      expect(() => {
        field.destroy();
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
