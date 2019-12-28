import { Element } from 'vaulty-js-sdk-elements/src/elements/Element';
import { ElementRoute } from '../ElementRoute';

describe('ElementRoute', () => {
  let route;
  let renderFunction;

  beforeEach(() => {
    renderFunction = jest.fn(() => {
      const input = document.createElement('input');
      input.type = 'text';
      return new Element(input);
    });
    route = new ElementRoute(
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

    it('should throw exception, when it does not return Element instance', () => {
      route = new ElementRoute(
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
