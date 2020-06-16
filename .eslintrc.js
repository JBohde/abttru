module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    $: true,
    Plotly: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'arrow-parens': [2, 'as-needed'],
    'arrow-body-style': [2, 'as-needed'],
    semi: ['error', 'always'],
    'comma-dangle': ['error', {
      functions: 'never',
      arrays: 'only-multiline',
      objects: 'only-multiline',
      imports: 'never',
      exports: 'never'
    }]
  },
};
