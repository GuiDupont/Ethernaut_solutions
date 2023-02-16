module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "no-unused-vars": "off",
  },

  extends: ["standard", "plugin:prettier/recommended"],
};
