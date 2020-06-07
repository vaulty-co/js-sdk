import { Message } from '@vaulty/common/src/channels/Message';

import { getFieldData } from '../getFieldData';
import {
  GET_FIELD_DATA_REQUEST,
  GET_FIELD_DATA_RESPONSE,
} from '../../../../../../fields/common/Field/messages';

jest.useFakeTimers();

describe('getFieldData', () => {
  let fakeController;
  let broadcastChannel;

  beforeEach(() => {
    broadcastChannel = {
      handlers: {},

      addEventListener(event, handler) {
        this.handlers[event] = [
          ...(this.handlers[event] ? this.handlers[event] : []),
          handler,
        ];
      },

      removeEventListener(event, handler) {
        if (this.handlers[event]) {
          this.handlers[event] = this.handlers[event]
            .filter((addedHandler) => addedHandler !== handler);
        }
      },

      postMessage(message) {
        if (this.handlers.message) {
          this.handlers.message.forEach((handler) => handler(message));
        }
      },
    };
    fakeController = {
      broadcastChannel,
    };
  });

  it('should request field about data', () => {
    const handler = jest.fn();
    const payload = {
      id: 'field-1',
      data: 'some-data',
    };
    broadcastChannel.addEventListener('message', handler);

    getFieldData.call(fakeController, 'field-1');

    expect(handler).toHaveBeenCalledWith(
      new Message(GET_FIELD_DATA_REQUEST, {
        fieldId: 'field-1',
      }).toString(),
    );
    broadcastChannel.postMessage(
      new Message(GET_FIELD_DATA_RESPONSE, payload).toString(),
    );
  });

  it('should get field data', () => {
    const payload = {
      id: 'field-1',
      data: 'some-data',
    };
    const promise = getFieldData.call(fakeController, 'field-1');

    broadcastChannel.postMessage(
      new Message(GET_FIELD_DATA_RESPONSE, payload).toString(),
    );

    return promise.then(
      (data) => expect(data).toEqual(payload),
    );
  });

  it('should reject with timeout error, when only other fields provided data', () => {
    const promise = getFieldData.call(fakeController, 'field-1');

    broadcastChannel.postMessage(
      new Message(GET_FIELD_DATA_RESPONSE, {
        id: 'field-2',
        data: 'another-data',
      }).toString(),
    );
    jest.runAllTimers();

    return promise.then(
      () => expect(false).toBe(true),
      () => expect(true).toBe(true),
    );
  });

  it('should reject with error, when field is not answered till timeout', () => {
    const promise = getFieldData.call(fakeController, 'field-1');

    jest.runAllTimers();

    return promise.then(
      () => expect(false).toBe(true),
      () => expect(true).toBe(true),
    );
  });

  it('should remove listener, when field data is provided', () => {
    const payload = {
      id: 'field-1',
      data: 'some-data',
    };

    const promise = getFieldData.call(fakeController, 'field-1');
    expect(broadcastChannel.handlers.message).toHaveLength(1);

    broadcastChannel.postMessage(
      new Message(GET_FIELD_DATA_RESPONSE, payload).toString(),
    );
    return promise.then(() => {
      expect(broadcastChannel.handlers.message).toHaveLength(0);
    });
  });
});
