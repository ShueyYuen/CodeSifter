# Ensure conditional directives (#if, #ifdef, #ifndef, #else, #endif) are properly paired (`@code-sifter/balanced-conditional-directives`)

<!-- end auto-generated rule header -->

This rule ensures that conditional directives (`#if`, `#ifdef`, `#ifndef`, `#else`, `#endif`) used in comments are properly balanced and follow the correct nesting structure.

## Rule Details

The conditional-loader project uses comment directives to conditionally include or exclude code. This ESLint rule helps you identify mismatched directives, unclosed blocks, and other common errors in your conditional compilation directives.

Examples of **incorrect** code for this rule:

```js
/* #if IS_LINUX */
console.log('Linux');
// Missing #endif

/* #else */
console.log('Other');
/* #endif */
// #else without a matching #if

/* #if IS_LINUX */
console.log('Linux');
/* #else */
console.log('Not Linux');
/* #else */
console.log('Other');
/* #endif */
// Multiple #else directives for one #if

/* #if */
console.log('Linux');
/* #endif */
// Empty condition in #if directive
```

Examples of **correct** code for this rule:

```js
/* #if IS_LINUX */
console.log('Linux');
/* #endif */

/* #if IS_LINUX */
console.log('Linux');
/* #else */
console.log('Other');
/* #endif */

/* #ifdef IS_LINUX */
console.log('Linux');
/* #endif */

/* #ifndef IS_WINDOWS */
console.log('Not Windows');
/* #endif */

<!-- #if IS_LINUX -->
<div>Linux</div>
<!-- #endif -->
```

## When Not To Use It

You might consider turning this rule off if you don't use conditional compilation directives in your project or if you're using a different syntax for conditional compilation.

## Further Reading

* [conditional-loader Documentation](https://github.com/ShueyYuen/CodeSifter)
