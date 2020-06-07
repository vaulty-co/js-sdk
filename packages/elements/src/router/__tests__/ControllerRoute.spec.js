import { enforceOptions } from 'broadcast-channel';
import { Controller } from '@vaulty/elements/src/controllers/common/Controller';

import { ControllerRoute } from '../ControllerRoute';

beforeAll(() => {
  enforceOptions({
    type: 'simulate',
  });
});

afterAll(() => {
  enforceOptions(null);
});

describe('ControllerRoute', () => {
  let route;
  let renderFunction;

  beforeEach(() => {
    renderFunction = jest.fn(() => new Controller());
    route = new ControllerRoute(
      'from',
      {
        controller: 'form',
      },
      renderFunction,
    );
  });

  describe('#render', () => {
    it('should run render function', () => {
      route.render();

      expect(renderFunction).toBeCalled();
    });

    it('should throw exception, when it does not return Controller instance', () => {
      route = new ControllerRoute(
        'form',
        {
          controller: 'form',
        },
        () => null,
      );

      expect(() => {
        route.render();
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
