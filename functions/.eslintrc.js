module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      generators: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    "quotes": ["error", "double"],
    "indent": "off",
    "comma-dangle": "off",
    "object-curly-spacing": ["error", "always"],
    "max-len": "off"
  },
};
