module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier
    'plugin:@next/next/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  plugins: [
    'prettier', // Prettier itself
  ],
  rules: {
    'prefer-const': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/prop-types': 'off', // Disable prop-types as we use TypeScript for type checking
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/react-in-jsx-scope': 'off', // Disable rule
    eqeqeq: ['error', 'always'], // Avoid use of == and !=
    'require-await': 'error', // Require await
    'no-duplicate-imports': 'error', // Found multiple import of the same path
    '@typescript-eslint/no-explicit-any': 'off',
    'react/no-unknown-property': [
      'error',
      { ignore: ['fs-cc', 'fs-cc-checkbox'] },
    ],
    semi: ['error', 'always'],
    // "quotes": ["error", "single"], // its better to use single quotes
    // "comma-dangle": ["error", "never"],
    'no-trailing-spaces': 'error',
    'prettier/prettier': 'error', // Ensures that your code conforms to Prettier formatting
  },
  settings: {
    react: {
      version: 'detect', // Automatically detects the version of React to use
    },
  },
};
