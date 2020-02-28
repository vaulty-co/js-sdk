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
 * @typedef {string} ValidatorName
 */

/**
 * @typedef {Object} FieldOptions
 * @property {FieldName} name
 * @property {FieldStyles} [style = {}] - field's styles
 * @property {Array<ValidatorName>} [validators = []] - validators for field
 */
