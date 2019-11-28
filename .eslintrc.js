module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es6: true,
      mocha: true,
    },
    extends: ['airbnb-base', 'prettier'],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
    },
    rules: {
      'no-unused-vars': ['error', { 'args': 'none' }]
    },
};