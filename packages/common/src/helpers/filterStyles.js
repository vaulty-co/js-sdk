/**
 * Remove from styles object disallowed property by allowedStyles properties array
 * @param {Object} styles
 * @param {Array<string>} allowedStyles
 * @return {Object}
 */
function filterStyles(styles, allowedStyles) {
  return allowedStyles.reduce((filteredStyles, allowedStyle) => {
    const resultStyles = filteredStyles;
    if (styles[allowedStyle]) {
      resultStyles[allowedStyle] = styles[allowedStyle];
    }
    return resultStyles;
  }, {});
}

export default filterStyles;
export {
  filterStyles,
};
