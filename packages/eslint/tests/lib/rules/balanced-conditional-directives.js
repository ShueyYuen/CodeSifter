/**
 * @fileoverview Tests for balanced-conditional-directives rule
 * @author Shuey Yuen
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/balanced-conditional-directives");
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("balanced-conditional-directives", rule, {
  valid: [
    // Valid if-endif pair
    `
    /* #if IS_LINUX */
    console.log('Linux');
    /* #endif */
    `,

    // Valid if-else-endif structure
    `
    /* #if IS_LINUX */
    console.log('Linux');
    /* #else */
    console.log('Other');
    /* #endif */
    `,

    // Valid nested structures
    `
    /* #if IS_LINUX */
    console.log('Linux');
    /* #if IS_HIGHPERFORMANCE_DEVICE */
    console.log('High performance');
    /* #endif */
    /* #endif */
    `,

    // Valid ifdef usage
    `
    /* #ifdef IS_LINUX */
    console.log('Linux');
    /* #endif */
    `,

    // Valid ifndef usage
    `
    /* #ifndef IS_WINDOWS */
    console.log('Not Windows');
    /* #endif */
    `,

    // Multiple directives in same file
    `
    /* #if IS_LINUX */
    console.log('Linux');
    /* #endif */

    /* #if IS_WINDOWS */
    console.log('Windows');
    /* #endif */
    `
  ],

  invalid: [
    // Missing endif
    {
      code: `
      /* #if IS_LINUX */
      console.log('Linux');
      `,
      errors: [{ messageId: "unclosedIf" }]
    },

    // Unexpected else without if
    {
      code: `
      /* #else */
      console.log('Other');
      /* #endif */
      `,
      errors: [{ messageId: "unmatchedElse" }, { messageId: "unmatchedEndif" }]
    },

    // Unexpected endif without if
    {
      code: `
      /* #endif */
      `,
      errors: [{ messageId: "unmatchedEndif" }]
    },

    // Multiple else directives
    {
      code: `
      /* #if IS_LINUX */
      console.log('Linux');
      /* #else */
      console.log('Not Linux');
      /* #else */
      console.log('Other');
      /* #endif */
      `,
      errors: [{ messageId: "multipleElse" }]
    },

    // Invalid condition (empty)
    {
      code: `
      /* #if */
      console.log('Linux');
      /* #endif */
      `,
      errors: [{ messageId: "invalidCondition" }]
    },

    // Incorrectly nested directives
    {
      code: `
      /* #if IS_LINUX */
      console.log('Linux');
      /* #if IS_HIGHPERFORMANCE_DEVICE */
      console.log('High performance');
      /* #endif */
      `,
      errors: [{ messageId: "unclosedIf" }]
    }
  ]
});
