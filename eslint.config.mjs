import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/", "**/dist/"] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    name: 'disables/test',
    files: ["**/*.spec.[jt]s?(x)"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025,
        ...globals.vitest
      }
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ['**/__tests__/**'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.node,
        ...globals.es2025,
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    }
  },
  {
    files: ["**/*.config.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    }
  },
  {
    name: 'disables/typechecking',
    files: [
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.d.ts',
      '**/*.d.cts',
      '**/__tests__/**',
      'docs/**',
      'playground/**',
      'scripts/**',
      '**/vitest.config.ts',
      '**/vitest.config.e2e.ts',
    ],
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
  },
  {
    name: 'playground/globals',
    files: ["playground/**"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2025,
        __IS_LINUX__: 'readonly',
        __IS_PRODUCTION__: 'readonly',
      }
    }
  },
  {
    files: ["packages/eslint/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    },
  }
);
