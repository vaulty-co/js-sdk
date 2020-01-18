import { Field } from '../index';

jest.mock('@js-sdk/utils/src/channels/SlaveChannel', () => {
  const connectMock = jest.fn();
  const subscribeMock = jest.fn();
  const destroyMock = jest.fn();

  class SlaveChannel {
    get connect() {
      return connectMock;
    }

    get subscribe() {
      return subscribeMock;
    }

    destroy() {
      return destroyMock;
    }
  }
  return {
    SlaveChannel,
  };
});

describe('Field', () => {
  describe('#constructor', () => {
    it('should throw error, when node is not HTMLELement', () => {
      const fieldNode = {};

      expect(() => {
        new Field({ node: fieldNode, channelId: 'channel-id' });
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('#mount', () => {
    let parentNode;
    let field;

    beforeEach(() => {
      field = new Field({
        node: document.createElement('div'),
        channelId: 'channel-id',
      });
      parentNode = document.createElement('div');
    });

    afterEach(() => {
      field.destroy();
      field = null;
      parentNode = null;
    });

    it('should throw error, when channelId is not specified', () => {
      field = new Field({ node: document.createElement('div') });

      expect(() => {
        field.mount(parentNode);
      }).toThrowErrorMatchingSnapshot();
    });

    it('should append field node to parent node', () => {
      field.mount(parentNode);

      expect(parentNode.firstChild).toBe(field.node);
    });

    it('should initialize slave channel connected to parent channel', () => {
      field.mount(parentNode);

      expect(field.fieldSlaveChannel.connect).toBeCalled();
    });

    it('should add handlers to slave channel', () => {
      field.mount(parentNode);

      expect(field.fieldSlaveChannel.subscribe).toBeCalled();
    });
  });

  describe('#appendTo', () => {
    it('should append field node in specified parent node', () => {
      const fieldNode = document.createElement('div');
      const parentNode = document.createElement('div');
      const field = new Field({ node: fieldNode, channelId: 'channel-id' });

      field.appendTo(parentNode);

      expect(parentNode.firstChild).toBe(fieldNode);
    });

    it('should throw error, when parent node is not HTMLElement', () => {
      const fieldNode = document.createElement('div');
      const parentNode = undefined;
      const field = new Field({ node: fieldNode, channelId: 'channel-id' });

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
      field = new Field({ node: fieldNode, channelId: 'channel-id' });

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
