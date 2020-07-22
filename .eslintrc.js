module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  plugins: ['@typescript-eslint', 'jsdoc'],
  extends: [
    'standard-with-typescript',
    'prettier/@typescript-eslint',
    'plugin:jsdoc/recommended',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always'],
    '@typescript-eslint/return-await': ['error', 'in-try-catch'],
    'jsdoc/require-jsdoc': [
      'error',
      {
        checkConstructors: false,
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
        },
      },
    ],
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',
  },
};
