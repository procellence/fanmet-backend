/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
  },
  ignorePatterns: [
    '*.js', 'dist',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {'argsIgnorePattern': '^_'}],
    '@typescript-eslint/no-empty-interface': 'off',
    'no-else-return': ['error'],
    'prefer-const': ['error'],
    'no-lonely-if': ['error'],
    'no-multi-assign': ['error'],
    'no-useless-escape': 'off',

    // styling
    'spaced-comment': ['error', 'always', {'markers': ['/']}],
    '@typescript-eslint/brace-style': ['error'],
    // '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/keyword-spacing': ['error'],
    '@typescript-eslint/type-annotation-spacing': ['error'],
    '@typescript-eslint/quotes': ['error', 'single', {'avoidEscape': true}],
    '@typescript-eslint/space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],
    '@typescript-eslint/object-curly-spacing': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-style': ['error'],
    'semi-spacing': ['error'],
    'semi': ['error'],
    'no-multi-spaces': ['error'],
    'no-whitespace-before-property': ['error'],
  },
  overrides: [
    {
      files: [
        'src/**/*.ts',
      ],
      excludedFiles: [
        '*.spec.ts',
        'src/environments/**'
      ],
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      extends: [
        'plugin:@angular-eslint/recommended',
      ],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'no-console': ['error', {allow: ['warn', 'error']}],
      },
    },
    {
      files: [
        'src/**/*.component.html',
      ],
      extends: [
        'plugin:@angular-eslint/template/recommended',
      ],
      rules: {
        '@angular-eslint/template/no-negated-async': 'off',
        'spaced-comment': 'off',
      },
    },
  ],
};
