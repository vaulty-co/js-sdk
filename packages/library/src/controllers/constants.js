/**
 * @enum {string}
 */
const CONTROLLER_NODE_STATUSES = {
  MOUNTED: 'mounted',
  UNMOUNTED: 'unmounted',
};
/**
 * @enum {string}
 */
const CONTROLLER_VALIDATION_STATUSES = {
  VALID: 'valid',
  INVALID: 'invalid',
  UNKNOWN: 'unknown',
};
/**
 * @enum {string}
 */
const CONTROLLER_READINESS_STATUSES = {
  LOADING: 'loading',
  READY: 'ready',
};

/**
 * Controller statuses
 * @enum {string}
 */
const CONTROLLER_STATUSES = {
  NODE: CONTROLLER_NODE_STATUSES,
  VALIDATION: CONTROLLER_VALIDATION_STATUSES,
  READINESS: CONTROLLER_READINESS_STATUSES,
};

export {
  CONTROLLER_NODE_STATUSES,
  CONTROLLER_VALIDATION_STATUSES,
  CONTROLLER_READINESS_STATUSES,
  CONTROLLER_STATUSES,
};
