import { Element } from '../index';

describe('Element', () => {
  describe('#constructor', () => {
    it('should throw error, when node is not HTMLELement', () => {
      const elementNode = {};

      expect(() => {
        new Element(elementNode);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#appendTo', () => {
    it('should append element node in specified parent node', () => {
      const elementNode = document.createElement('div');
      const parentNode = document.createElement('div');
      const element = new Element(elementNode);

      element.appendTo(parentNode);

      expect(parentNode.firstChild).toBe(elementNode);
    });

    it('should throw error, when parent node is not HTMLElement', () => {
      const elementNode = document.createElement('div');
      const parentNode = undefined;
      const element = new Element(elementNode);

      expect(() => {
        element.appendTo(parentNode);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#destroy', () => {
    let elementNode;
    let parentNode;
    let element;

    beforeEach(() => {
      elementNode = document.createElement('div');
      parentNode = document.createElement('div');
      element = new Element(elementNode);

      element.appendTo(parentNode);
    });

    it('should remove node from parent, if element has been appended to its', () => {
      element.destroy();

      expect(parentNode.firstChild).toBe(null);
    });

    it('should clear all references about nodes (parent and element node)', () => {
      element.destroy();

      expect(element.node).toBe(null);
      expect(element.parent).toBe(null);
    });

    it('should throw exception when appendTo is called after destroying', () => {
      element.destroy();

      expect(() => {
        element.appendTo(parentNode);
      }).toThrowErrorMatchingSnapshot();
    });

    it('should throw exception when destroy is called after destroying', () => {
      element.destroy();

      expect(() => {
        element.destroy();
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
