module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'curly': 0,
    'semi': 0,
    'comma-dangle': [2, 'always-multiline'],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/quotes': [2, 'single'],
    '@typescript-eslint/semi': [2, 'never']
  }
}
