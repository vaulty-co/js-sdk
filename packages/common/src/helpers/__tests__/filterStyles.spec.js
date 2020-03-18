import { filterStyles } from '../filterStyles';

describe('filterStyles', () => {
  it('should filter styles by allowed properties array', () => {
    const styles = {
      width: '10px',
      height: '10px',
      background: 'url("some-background-url")',
    };
    const allowedStyles = ['width', 'height'];

    expect(filterStyles(styles, allowedStyles)).toEqual({
      width: '10px',
      height: '10px',
    });
  });

  it('should not add empty property, if an allowed style is not defined in initial styles', () => {
    const styles = {
      width: '10px',
      height: '10px',
      background: 'url("some-background-url")',
    };
    const allowedStyles = ['width', 'padding'];

    expect(filterStyles(styles, allowedStyles)).toEqual({
      width: '10px',
    });
  });
});
