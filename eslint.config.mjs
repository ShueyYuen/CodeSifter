import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";


export default defineConfig([
  { ignores: ["node_modules/", "**/dist/"] },
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  tseslint.configs.recommended,
  {
    files: ["**/*.config.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    }
  },
]);
