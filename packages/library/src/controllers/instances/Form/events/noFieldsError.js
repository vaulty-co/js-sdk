const NO_FIELDS_ERROR = {
  success: false,
  error: {
    code: 1,
    message: 'There are not fields assigned to form.',
  },
};

const FORM_IS_NOT_VALID = {
  success: false,
  error: {
    code: 2,
    message: 'Submitted form is not valid.',
  },
};

const FORM_HAS_UNFINISHED_PROCESS = {
  success: false,
  error: {
    code: 2,
    message: 'Submitted form has unfinished process.',
  },
};

export {
  NO_FIELDS_ERROR,
  FORM_IS_NOT_VALID,
  FORM_HAS_UNFINISHED_PROCESS,
};
