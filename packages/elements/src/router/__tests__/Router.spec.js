import { createBrowserHistory } from 'history';
import { Field } from '@js-sdk/elements/src/fields/Field';

import { Router } from '../index';
import { FieldRoute } from '../FieldRoute';

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
  let inputField;
  let selectField;
  let inputRoute;
  let selectRoute;
  let router;

  beforeEach(() => {
    appNode = document.createElement('div');
    inputField = new Field(document.createElement('div'));
    selectField = new Field(document.createElement('div'));
    inputRoute = new FieldRoute('input', { type: 'input' }, () => inputField);
    selectRoute = new FieldRoute('select', { type: 'select' }, () => selectField);
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

      expect(router.mountedInstances).toEqual([selectField]);
      expect(appNode.children[0]).toEqual(selectField.node);
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

      expect(router.mountedInstances).toEqual([inputField]);
      expect(appNode.children[0]).toBe(inputField.node);
    });

    it('should re-render, when route is changed', () => {
      router.locationSearch = 'type=input';
      router.render();
      router.locationSearch = 'type=select';

      router.render();

      expect(router.mountedInstances).toEqual([selectField]);
      expect(appNode.children[0]).toBe(selectField.node);
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
