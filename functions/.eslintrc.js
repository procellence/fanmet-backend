/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  ignorePatterns: ['dist'],
  extends: [
    '../.eslintrc.js',
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-console': ['error'], // use nest logger instead
    'object-curly-spacing': ['error', 'always'],
    'space-before-blocks': 'error',
    'keyword-spacing': ['error', {'after': true}],

    '@typescript-eslint/interface-name-prefix': 'off'
  },
};
