import { createSelector } from 'reselect';
import { sdkIdSelector } from '../../../store/selectors';

/**
 * @param {SDKState} state
 * @return {FieldsCollection}
 */
const fieldsSelector = (state) => state.fields;
/**
 * @param {string} fieldId
 * @return {function(state: SDKState): ?FieldModel}
 */
const makeFieldSelector = (fieldId) => (
  createSelector(
    fieldsSelector,
    (fields) => fields.getField(fieldId),
  )
);
/**
 * @param {string} fieldId
 * @return {function(state: SDKState): string}
 */
const makeFieldParamsSelector = (fieldId) => (
  createSelector(
    sdkIdSelector,
    (sdkId) => `channelId=${fieldId}&sdkId=${sdkId}`,
  )
);

export {
  fieldsSelector,
  makeFieldSelector,
  makeFieldParamsSelector,
};
