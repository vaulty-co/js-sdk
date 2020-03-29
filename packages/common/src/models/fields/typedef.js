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
 * @typedef {string} FieldName
 * @description
 * It is used for sending data from field in Form.
 */

/**
 * @typedef {string} FieldPlaceholder
 * @description
 * Placeholder data for field.
 */

/**
 * @typedef {string} ValidatorName
 */

/**
 * @typedef {Object} FieldSettings
 * @property {FieldName} name
 * @property {?FieldPlaceholder} [placeholder = null]
 * @property {boolean} [disabled = false]
 * @property {FieldStyles} [style = {}] - field's styles
 * @property {Array<ValidatorName>} [validators = []] - validators for field
 */

/**
 * @typedef {Object} FieldValidationStatus
 * @property {FIELD_VALIDATION_STATUSES} status
 * @property {Array<ValidatorName>} invalidValidators
 */

/**
 * @typedef {Object} FieldStatus
 * @property {FIELD_NODE_STATUSES} [node]
 * @property {FIELD_CONTENT_STATUSES} [content]
 * @property {FieldValidationStatus} [validation]
 * @property {FIELD_READINESS_STATUSES} [readiness]
 * @property {FIELD_FOCUS_STATUSES} [focus]
 */

/**
 * @typedef {Object} FieldAttributes
 * @property {boolean} [disabled = false]
 * @property {?FieldPlaceholder} [placeholder = null]
 */

/**
 * @typedef {Object} FieldModelOptions
 * @property {string} [id = uniqueId()]
 * @property {string} [type='unknown'] - type of field
 * @property {FieldStatus} [status = INITIAL_FIELD_STATUS]
 * @property {FieldSettings} [settings={}]
 */

/**
 * @typedef {Object} FieldModelJSON
 * @property {string} id
 * @property {string} type
 * @property {FieldStatus} status
 * @property {FieldSettings} settings
 */
