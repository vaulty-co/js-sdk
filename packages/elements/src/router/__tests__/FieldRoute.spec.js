import { enforceOptions } from 'broadcast-channel';
import { Node } from '@vaulty/common/src/nodes/Node';

import { Field } from '@vaulty/elements/src/fields/common/Field';
import { FieldRoute } from '../FieldRoute';

beforeAll(() => {
  enforceOptions({
    type: 'simulate',
  });
});

afterAll(() => {
  enforceOptions(null);
});

describe('FieldRoute', () => {
  let route;
  let renderFunction;

  beforeEach(() => {
    renderFunction = jest.fn(() => {
      const input = document.createElement('input');
      input.type = 'text';
      return new Field({ node: new Node({ node: input }), channelId: 'input-channel-id' });
    });
    route = new FieldRoute(
      'inputText',
      {
        field: 'input',
        type: 'text',
      },
      renderFunction,
    );
  });

  describe('#render', () => {
    it('should run render function', () => {
      route.render();

      expect(renderFunction).toBeCalled();
    });

    it('should throw exception, when it does not return Field instance', () => {
      route = new FieldRoute(
        'inputText',
        {
          field: 'input',
          type: 'text',
        },
        () => null,
      );

      expect(() => {
        route.render();
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
