import { createBrowserHistory } from 'history';
import { Element } from 'vaulty-js-sdk-elements/src/elements/Element';

import { Router } from '../index';
import { ElementRoute } from '../ElementRoute';

jest.mock('history', () => {
  const history = {
    lastListener: null,
    location: {
      search: 'test=value',
    },
    listen: jest.fn(function (callback) {
      this.lastListener = callback;
      return jest.fn();
    }),
  };
  return ({
    createBrowserHistory: () => history,
  });
});

describe('Router', () => {
  let appNode;
  let inputElement;
  let selectElement;
  let inputRoute;
  let selectRoute;
  let router;

  beforeEach(() => {
    appNode = document.createElement('div');
    inputElement = new Element(document.createElement('div'));
    selectElement = new Element(document.createElement('div'));
    inputRoute = new ElementRoute('input', { type: 'input' }, () => inputElement);
    selectRoute = new ElementRoute('select', { type: 'select' }, () => selectElement);
    router = new Router(appNode);
    router.register(inputRoute);
    router.register(selectRoute);
  });

  afterEach(() => {
    appNode = null;
  });

  describe('#constructor', () => {
    it('should listen history', () => {
      expect(router.history.listen).toBeCalled();
    });

    it('should re-render by new query string, when it is changed', () => {
      const history = createBrowserHistory();
      router.locationSearch = 'type=input';
      router.render();

      history.lastListener({ search: 'type=select' });

      expect(router.mountedInstances).toEqual([selectElement]);
      expect(appNode.children[0]).toEqual(selectElement.node);
    });
  });

  describe('#register', () => {
    it('should register route in router', () => {
      expect(router.routes).toEqual([inputRoute, selectRoute]);
    });
  });

  describe('#unregister', () => {
    it('should remove route from router', () => {
      router.unregister(inputRoute);

      expect(router.routes).toEqual([selectRoute]);
    });
  });

  describe('#render', () => {
    it('should render nothing when current query string is not matched with routes', () => {
      router.locationSearch = 'type=unknown';

      router.render();

      expect(router.mountedInstances).toHaveLength(0);
      expect(appNode.children).toHaveLength(0);
    });

    it('should render matched instances from routes', () => {
      router.locationSearch = 'type=input';

      router.render();

      expect(router.mountedInstances).toEqual([inputElement]);
      expect(appNode.children[0]).toBe(inputElement.node);
    });

    it('should re-render, when route is changed', () => {
      router.locationSearch = 'type=input';
      router.render();
      router.locationSearch = 'type=select';

      router.render();

      expect(router.mountedInstances).toEqual([selectElement]);
      expect(appNode.children[0]).toBe(selectElement.node);
    });
  });

  describe('#destroy', () => {
    it('should unregister history listener', () => {
      router.destroy();

      expect(router.historyUnlisten).toBeCalled();
    });

    it('should unmount all rendered instances', () => {
      router.locationSearch = 'type=input';
      router.render();

      router.destroy();

      expect(router.mountedInstances).toHaveLength(0);
      expect(appNode.children).toHaveLength(0);
    });
  });
});
