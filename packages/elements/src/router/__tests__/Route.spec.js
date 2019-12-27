import { Element } from 'vaulty-js-sdk-elements/src/elements/Element';
import { Route } from '../Route';

describe('Route', () => {
  let route;
  let renderFunction;

  beforeEach(() => {
    renderFunction = jest.fn(() => {
      const input = document.createElement('input');
      input.type = 'text';
      return new Element(input);
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
    it('should match query string with route params, if query string contains them', () => {
      const queryString = 'field=input&type=text&otherParam=1';

      expect(route.match(queryString)).toBe(true);
    });

    it('should not match query string with route params, if query string does not contain them', () => {
      const queryString = 'field=select&type=text&otherParam=1';

      expect(route.match(queryString)).toBe(false);
    });
  });

  describe('#render', () => {
    it('should run render function', () => {
      route.render();

      expect(renderFunction).toBeCalled();
    });

    it('should throw exception, when it does not return Element instance', () => {
      route = new Route(
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
