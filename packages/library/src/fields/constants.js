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

/**
 * @enum {string}
 */
const FIELD_NODE_STATUSES = {
  MOUNTED: 'mounted',
  UNMOUNTED: 'unmounted',
};
/**
 * @enum {string}
 */
const FIELD_CONTENT_STATUSES = {
  DIRTY: 'dirty',
  EMPTY: 'empty',
};
/**
 * @enum {string}
 */
const FIELD_VALIDATION_STATUSES = {
  VALID: 'valid',
  INVALID: 'invalid',
  UNKNOWN: 'unknown',
};
/**
 * @enum {string}
 */
const FIELD_READINESS_STATUSES = {
  LOADING: 'loading',
  READY: 'ready',
};

/**
 * @enum {string}
 */
const FIELD_FOCUS_STATUSES = {
  FOCUSED: 'focused',
  UNFOCUSED: 'unfocused',
};

export {
  DEFAULT_FIELD_STYLES,
  ALLOWED_STYLED_PROPS,
  FIELD_NODE_STATUSES,
  FIELD_CONTENT_STATUSES,
  FIELD_VALIDATION_STATUSES,
  FIELD_READINESS_STATUSES,
  FIELD_FOCUS_STATUSES,
};
