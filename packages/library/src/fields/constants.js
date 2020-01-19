/**
 * @typedef {Object} FieldStyles
 * @property {string} [width = '100%']
 * @property {string} [height = '24px']
 * @property {string} [fontSize = '12px']
 * @property {string} [fontFamily]
 * @property {string} [color]
 * @property {string} [fontWeight = 'normal']
 * @property {string} [lineHeight = '24px']
 * @property {string} [padding = '5px']
 * @property {string} [padding = '5px']
 */

/**
 * @type {FieldStyles}
 */
const DEFAULT_FIELD_STYLES = {
  width: '100%',
  height: '24px',
  fontSize: '12px',
  fontWeight: 'normal',
  lineHeight: '24px',
  padding: '5px',
};

const ALLOWED_STYLED_PROPS = [
  'width',
  'height',
  'fontSize',
  'fontWeight',
  'fontFamily',
  'lineHeight',
  'color',
  'padding',
];

export {
  DEFAULT_FIELD_STYLES,
  ALLOWED_STYLED_PROPS,
};
