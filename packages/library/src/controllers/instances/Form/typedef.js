/**
 * @typedef {Object} FormOptions
 * @extends ControllerOptions
 * @property {string} action - URL, where data should be submitted
 * @property {string} encode - type of submitting data (url encode, json etc.)
 * @property {string} method - method of sending data (POST, GET etc.)
 * @property {Object} headers - headers, which should be provided in action call
 */

/**
 * @typedef {Object} FormSubmitOptions
 * @property {Object} data - additional data, which is attached to fields data on submit
 * @property {Object} headers - additional headers, which should be provided in action call.
 * They are merged with initial form headers and are replaced, if some of them are different.
 */
