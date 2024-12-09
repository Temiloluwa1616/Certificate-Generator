module.exports = {
  env: {
    es6: true,
    node: true, // Ensure Node.js environment is set
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021, // Using ES2021 features
  },
  extends: [
    "eslint:recommended", // Recommended ESLint rules
    "google", // Google style guide
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"], // Restricted globals
    "prefer-arrow-callback": "error", // Prefer arrow callbacks
    "quotes": ["error", "double", { "allowTemplateLiterals": true }], // Enforce double quotes
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true, // Mocha environment for test files
      },
      rules: {},
    },
  ],
};
