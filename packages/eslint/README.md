# eslint-plugin-code-sifter

work with code-sifter

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@code-sifter/eslint-plugin`:

```sh
npm install @code-sifter/eslint-plugin --save-dev
```

## Usage

In your [configuration file](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file), import the plugin `eslint-plugin-code-sifter` and add `code-sifter` to the `plugins` key:

```js
import codeSifter from "@code-sifter/eslint-plugin";

export default [
    {
        plugins: {
            codeSifter
        }
    }
];
```


Then configure the rules you want to use under the `rules` key.

```js
import codeSifter from "@code-sifter/eslint-plugin";

export default [
    {
        plugins: {
            codeSifter
        },
        rules: {
            "code-sifter/balanced-conditional-directives": "error"
        }
    }
];
```



## Configurations

<!-- begin auto-generated configs list -->
TODO: Run eslint-doc-generator to generate the configs list (or delete this section if no configs are offered).
<!-- end auto-generated configs list -->



## Rules

<!-- begin auto-generated rules list -->

| Name                                                                             | Description                                                                             |
| :------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| [balanced-conditional-directives](docs/rules/balanced-conditional-directives.md) | Ensure conditional directives (#if, #ifdef, #ifndef, #else, #endif) are properly paired |

<!-- end auto-generated rules list -->


