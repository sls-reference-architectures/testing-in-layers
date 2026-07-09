module.exports = {
  env: {
    jest: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  root: true,
  rules: {
    'no-use-before-define': 0,
    'import/extensions': 0,
  },
};
