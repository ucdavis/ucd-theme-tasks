import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        Drupal: true,
        drupalSettings: true,
        drupalTranslations: true,
      },
    },

    rules: {
      "no-unused-vars": [2, {
        "caughtErrors": "none",
      }]
    }
  }
];
