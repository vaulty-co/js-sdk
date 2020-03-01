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

/**
 * Field statuses
 * @enum {string}
 */
const FIELD_STATUSES = {
  NODE: FIELD_NODE_STATUSES,
  CONTENT: FIELD_CONTENT_STATUSES,
  VALIDATION: FIELD_VALIDATION_STATUSES,
  READINESS: FIELD_READINESS_STATUSES,
  FOCUS: FIELD_FOCUS_STATUSES,
};

const INITIAL_FIELD_STATUS = {
  node: FIELD_NODE_STATUSES.UNMOUNTED,
  content: FIELD_CONTENT_STATUSES.EMPTY,
  validation: {
    status: FIELD_VALIDATION_STATUSES.UNKNOWN,
    invalidValidators: [],
  },
  readiness: FIELD_READINESS_STATUSES.LOADING,
  focus: FIELD_FOCUS_STATUSES.UNFOCUSED,
};

export {
  DEFAULT_FIELD_STYLES,
  ALLOWED_STYLED_PROPS,
  FIELD_STATUSES,
  FIELD_NODE_STATUSES,
  FIELD_CONTENT_STATUSES,
  FIELD_VALIDATION_STATUSES,
  FIELD_READINESS_STATUSES,
  FIELD_FOCUS_STATUSES,
  INITIAL_FIELD_STATUS,
};
