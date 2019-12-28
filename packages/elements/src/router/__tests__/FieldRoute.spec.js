import { Field } from 'vaulty-js-sdk-elements/src/fields/Field';
import { FieldRoute } from '../FieldRoute';

describe('FieldRoute', () => {
  let route;
  let renderFunction;

  beforeEach(() => {
    renderFunction = jest.fn(() => {
      const input = document.createElement('input');
      input.type = 'text';
      return new Field(input);
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
