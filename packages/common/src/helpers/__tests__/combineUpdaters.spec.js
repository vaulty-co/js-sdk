import { combineUpdaters } from '../combineUpdaters';

describe('combineUpdaters', () => {
  it('should combine updaters functions by their map', () => {
    const updatersMap = {
      firstProp: (prev, next) => next.firstProp || prev.firstProp,
      secondProp: (prev, next) => next.secondProp || prev.secondProp,
    };

    const combinedUpdaters = combineUpdaters(updatersMap);

    expect(combinedUpdaters({ fistProp: 1 }, { firstProp: 2, secondProp: 3 })).toEqual({
      firstProp: 2,
      secondProp: 3,
    });
    expect(combinedUpdaters({ secondProp: 1 }, { secondProp: 3 })).toEqual({
      secondProp: 3,
    });
  });
});
