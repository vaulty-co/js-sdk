import { enforceOptions } from 'broadcast-channel';
import { Node } from '@vaulty/common/src/nodes/Node';
import { Message } from '@vaulty/common/src/channels/Message';

import { Field } from '../index';
import { FIELD_LOADED_WATCHER } from '../messages';

jest.mock('@vaulty/common/src/channels/SlaveChannel', () => {
  const connectMock = jest.fn();
  const subscribeMock = jest.fn();
  const postMessageMock = jest.fn();
  const destroyMock = jest.fn();

  class SlaveChannel {
    get connect() {
      return connectMock;
    }

    get subscribe() {
      return subscribeMock;
    }

    get postMessage() {
      return postMessageMock;
    }

    destroy() {
      return destroyMock;
    }
  }
  return {
    SlaveChannel,
  };
});

const createNode = () => (
  new Node({
    node: document.createElement('div'),
  })
);

beforeAll(() => {
  enforceOptions({
    type: 'simulate',
  });
});

afterAll(() => {
  enforceOptions(null);
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
        node: createNode(),
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
      field = new Field({ node: createNode() });

      expect(() => {
        field.mount(parentNode);
      }).toThrowErrorMatchingSnapshot();
    });

    it('should append field node to parent node', () => {
      field.mount(parentNode);

      expect(parentNode.firstChild).toBe(field.fieldNode.node);
    });

    it('should initialize slave channel connected to parent channel', () => {
      field.mount(parentNode);

      expect(field.fieldSlaveChannel.connect).toBeCalled();
    });

    it('should post message that field is loaded', () => {
      field.mount(parentNode);

      expect(field.fieldSlaveChannel.postMessage).toBeCalledWith(
        new Message(FIELD_LOADED_WATCHER),
      );
    });

    it('should add handlers to slave channel', () => {
      field.mount(parentNode);

      expect(field.fieldSlaveChannel.subscribe).toBeCalled();
    });
  });

  describe('#appendTo', () => {
    it('should append field node in specified parent node', () => {
      const fieldNode = createNode();
      const parentNode = document.createElement('div');
      const field = new Field({ node: fieldNode, channelId: 'channel-id' });

      field.appendTo(parentNode);

      expect(parentNode.firstChild).toBe(fieldNode.node);
    });

    it('should throw error, when parent node is not HTMLElement', () => {
      const fieldNode = createNode();
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
      fieldNode = createNode();
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

      expect(field.fieldNode).toBe(null);
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
