/**
 * @typedef {Object} ControllerStatus
 * @property {CONTROLLER_NODE_STATUSES} [node]
 * @property {CONTROLLER_READINESS_STATUSES} [readiness]
 */

/**
 * @typedef {Object} ComputedControllerStatus
 * @property {CONTROLLER_NODE_STATUSES} [node]
 * @property {CONTROLLER_VALIDATION_STATUSES} [validation]
 * @property {CONTROLLER_READINESS_STATUSES} [readiness]
 */

/**
 * @typedef {Object} ControllerModelOptions
 * @property {string} [id]
 * @property {Array<string>} fieldsIds
 * @property {ControllerStatus} [status = INITIAL_CONTROLLER_STATUS]
 */

/**
 * @typedef {Object} ControllerModelJSON
 * @property {string} id
 * @property {Array<string>} fieldsIds
 * @property {ControllerStatus} status
 */
