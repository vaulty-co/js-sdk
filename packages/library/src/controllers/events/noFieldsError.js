const ERROR_MESSAGE = 'There are not fields assigned to form.';
const ERROR_CODE = '1';
const NO_FIELDS_ERROR = {
  success: false,
  error: {
    code: ERROR_CODE,
    ERROR_MESSAGE,
  },
};

export {
  ERROR_CODE,
  ERROR_MESSAGE,
  NO_FIELDS_ERROR,
};
