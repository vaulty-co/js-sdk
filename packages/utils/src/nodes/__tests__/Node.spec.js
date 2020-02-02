import { Node } from '../Node';

describe('Node', () => {
  let nodeInstance;

  beforeEach(() => {
    nodeInstance = new Node({
      node: document.createElement('div'),
    });
  });

  describe('#appendTo', () => {

  });

  describe('#addClass', () => {
    it('should add class to node, when classes are not defined', () => {
      nodeInstance.addClass('first_class');

      expect(nodeInstance.node.className).toBe('first_class');
    });

    it('should add class to node, when classes are defined', () => {
      nodeInstance.node.className = 'first_class second_class';

      nodeInstance.addClass('additional_class');

      expect(nodeInstance.node.className).toBe('first_class second_class additional_class');
    });
  });

  describe('#removeClass', () => {
    it('should do nothing, when classes are not defined', () => {
      nodeInstance.removeClass('some_class');

      expect(nodeInstance.node.className).toBe('');
    });

    it('should do nothing, when class is not found', () => {
      nodeInstance.node.className = 'first_class  second_class';

      nodeInstance.removeClass('additional_class');

      expect(nodeInstance.node.className).toBe('first_class  second_class');
    });

    it('should remove class when class is found', () => {
      nodeInstance.node.className = 'first_class  second_class';

      nodeInstance.removeClass('second_class');

      expect(nodeInstance.node.className).toBe('first_class');
    });
  });

  describe('#setStyle', () => {

  });

  describe('#on', () => {

  });

  describe('#off', () => {

  });

  describe('#destroy', () => {

  });
});
