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
import code-sifter from "eslint-plugin-code-sifter";

export default [
    {
        plugins: {
            code-sifter
        },
        rules: {
            "code-sifter/rule-name": "warn"
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
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


