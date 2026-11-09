import js from "@eslint/js";

export default [
  { ignores: ["**/node_modules/**", "**/dist/**", "**/coverage/**", "harness/evidence/**"] },
  js.configs.recommended,
  { languageOptions: { globals: { console: "readonly", process: "readonly", Buffer: "readonly", fetch: "readonly", performance: "readonly" } }, rules: { "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }] } }
];
