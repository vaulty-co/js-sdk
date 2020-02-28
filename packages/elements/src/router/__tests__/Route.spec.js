import { enforceOptions } from 'broadcast-channel';
import { Node } from '@js-sdk/utils/src/nodes/Node';
import { Field } from '@js-sdk/elements/src/fields/common/Field';

import { Route } from '../Route';

beforeAll(() => {
  enforceOptions({
    type: 'simulate',
  });
});

afterAll(() => {
  enforceOptions(null);
});

describe('Route', () => {
  let route;
  let renderFunction;

  beforeEach(() => {
    renderFunction = jest.fn(() => {
      const input = document.createElement('input');
      input.type = 'text';
      return new Field({ node: new Node({ node: input }), channelId: 'some-channel-id' });
    });
    route = new Route(
      'inputText',
      {
        field: 'input',
        type: 'text',
      },
      renderFunction,
    );
  });

  describe('#match', () => {
    it('should match query params with route params, if query params contains them', () => {
      const queryString = 'field=input&type=text&otherParam=1';
      const queryParams = new URLSearchParams(queryString);

      expect(route.match(queryParams)).toBe(true);
    });

    it('should not match query params with route params, if query params does not contain them', () => {
      const queryString = 'field=select&type=text&otherParam=1';
      const queryParams = new URLSearchParams(queryString);

      expect(route.match(queryParams)).toBe(false);
    });
  });

  describe('#render', () => {
    const queryString = 'field=select&type=text&otherParam=1';
    const queryParams = new URLSearchParams(queryString);

    it('should run render function', () => {
      route.render(queryParams);

      expect(renderFunction).toBeCalled();
    });

    it('should provide query params in render function', () => {
      route.render(queryParams);

      expect(renderFunction).toBeCalledWith(queryParams);
    });

    it('should return render function result', () => {
      route = new Route(
        'inputText',
        {
          field: 'input',
          type: 'text',
        },
        () => null,
      );

      expect(route.render(queryParams)).toBe(null);
    });

    it('should provide query params in render function', () => {
      route = new Route(
        'inputText',
        {
          field: 'input',
          type: 'text',
        },
        (renderQueryParams) => renderQueryParams.get('otherParam'),
      );

      expect(route.render(queryParams)).toBe('1');
    });
  });
});
