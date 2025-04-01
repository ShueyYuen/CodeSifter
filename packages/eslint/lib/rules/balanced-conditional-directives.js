/**
 * @fileoverview Rule to check if conditional directives (#if, #else, #endif) are properly paired
 * @author Shuey Yuen
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Ensure conditional directives (#if, #ifdef, #ifndef, #else, #endif) are properly paired",
      recommended: true,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null,
    schema: [], // no options
    messages: {
      unmatchedElse: "#else directive without matching #if",
      unmatchedEndif: "#endif directive without matching #if or #else",
      multipleElse: "Unexpected #else after #else",
      unclosedIf: "Unclosed conditional block, missing #endif",
      invalidCondition: "Invalid condition in directive",
      unexpectedDirective: "Unexpected #{{directiveType}} after #{{parentType}}",
    },
  },

  create(context) {
    // This pattern is aligned with the DIRECTIVE_PATTERN from the project's core/process.ts file
    // It matches both HTML comments (<!-- #if ... -->) and JS/CSS comments (/* #if ... */)
    const directivePattern = /\s*(?:<!--|\{?\/\*)\s+#(if(?:n?def)?|else|endif)((?<=#i\S*)[\s\S]+?|\s+)(?:(?<=<!--.*)-->|(?<=\/\*.*)\*\/\}?)/;

    // Map directive types to their expected following directive types
    // This matches the DIRECTIVE_SEQUENCE_MAP from the original code
    const directiveSequenceMap = {
      if: ["else", "endif"],
      ifdef: ["else", "endif"],
      ifndef: ["else", "endif"],
      else: ["endif"],
    };

    // Helper function to check if a condition is valid
    function isValidCondition(condition, directiveType) {
      if (!condition && directiveType.startsWith('if')) {
        return false;
      }
      return true;
    }

    return {
      Program() {
        const sourceCode = context.sourceCode;
        const comments = sourceCode.getAllComments();

        // We'll use a stack to track conditional directive blocks
        const stack = [];

        for (const comment of comments) {
          const text = comment.value;
          // For block comments, we need to check the full text including the comment markers
          const fullText = `/*${text}*/`;

          // Check if the comment contains a directive
          let match = directivePattern.exec(fullText);

          if (!match) {
            // For HTML-style comments, try a different format
            match = directivePattern.exec(`<!--${text}-->`);
            if (!match) continue;
          }

          const [, directiveType, conditionWithSpace] = match;
          const condition = conditionWithSpace ? conditionWithSpace.trim() : '';

          const directiveNode = {
            type: directiveType,
            condition,
            node: comment,
          };

          // Check condition validity for if* directives
          if (!isValidCondition(condition, directiveType) && directiveType !== 'endif' && directiveType !== 'else') {
            context.report({
              node: comment,
              messageId: "invalidCondition",
            });
          }

          // Handle directive based on its type
          if (directiveType.startsWith("if")) {
            stack.push(directiveNode);
          } else if (directiveType === "else") {
            if (stack.length === 0) {
              context.report({
                node: comment,
                messageId: "unmatchedElse",
              });
            } else {
              const lastDirective = stack[stack.length - 1];
              if (lastDirective.type === "else") {
                context.report({
                  node: comment,
                  messageId: "multipleElse",
                });
              } else if (!directiveSequenceMap[lastDirective.type] ||
                        !directiveSequenceMap[lastDirective.type].includes("else")) {
                context.report({
                  node: comment,
                  messageId: "unexpectedDirective",
                  data: {
                    directiveType: "else",
                    parentType: lastDirective.type
                  }
                });
              } else {
                // Replace the top of the stack with this else directive
                stack.pop();
                stack.push(directiveNode);
              }
            }
          } else if (directiveType === "endif") {
            if (stack.length === 0) {
              context.report({
                node: comment,
                messageId: "unmatchedEndif",
              });
            } else {
              const lastDirective = stack[stack.length - 1];
              if (!directiveSequenceMap[lastDirective.type] ||
                  !directiveSequenceMap[lastDirective.type].includes("endif")) {
                context.report({
                  node: comment,
                  messageId: "unexpectedDirective",
                  data: {
                    directiveType: "endif",
                    parentType: lastDirective.type
                  }
                });
              }
              // Pop the last directive as it's now closed with #endif
              stack.pop();
            }
          }
        }

        // Check for any unclosed directives left on the stack
        for (const directive of stack) {
          context.report({
            node: directive.node,
            messageId: "unclosedIf",
          });
        }
      },
    };
  },
};
