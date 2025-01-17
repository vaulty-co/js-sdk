module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'jest',
  ],
  env: {
    browser: true,
    'jest/globals': true,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-new': 'off',
    'max-len': ['error', 100, 2, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
  },
};
