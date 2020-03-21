const baseConfig = require('../../.eslintrc.js');

module.exports = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'airbnb',
  ],
  rules: {
    ...baseConfig.rules,
    'react/jsx-filename-extension': [1, { 'extensions': ['.js', '.jsx'] }],
    'jsx-a11y/label-has-associated-control': 'off',
    'react/forbid-prop-types': 'off',
  },
};
