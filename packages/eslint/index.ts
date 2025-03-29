import type { Rule } from 'eslint';

// Regex pattern to match conditional directives
const DIRECTIVE_PATTERN = /\s*#(if(?:n?def)?|else|endif)((?<=#i\S*)[\s\S]+?|\s+)/;

/**
 * Type definition for ESLint message
 */
interface LintMessage {
  ruleId: string | null;
  severity: number;
  message: string;
  line?: number;
  column?: number;
  nodeType?: string;
  source?: string | null;
  endLine?: number;
  endColumn?: number;
}

/**
 * Creates an ESLint processor for handling conditional comments
 */
const processor = {
  // Preprocess method removes conditional comments before linting
  preprocess(text: string): string[] {
    // Find and temporarily replace conditional comments to prevent parsing errors
    let processedText = text;

    // Replace inline conditional comments to avoid breaking code
    processedText = processedText.replace(
      /\/\*\s*#(if(?:n?def)?|else|endif)[\s\S]*?\*\//g,
      () => '/* conditional-comment */'
    );

    // Replace HTML-style conditional comments
    processedText = processedText.replace(
      /<!--\s*#(if(?:n?def)?|else|endif)[\s\S]*?-->/g,
      () => '<!-- conditional-comment -->'
    );

    return [processedText];
  },

  // No need to post-process since we're just avoiding errors
  postprocess(messages: LintMessage[][]): LintMessage[] {
    // Flatten the messages array
    return messages.flat();
  }
};

interface ESLintComment {
  value: string;
  type: string;
  range?: [number, number];
};

/**
 * Rule to check for unbalanced conditional directives
 */
const unbalancedDirectivesRule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure conditional directives (#if, #else, #endif) are properly balanced',
      category: 'Possible Errors',
      recommended: true,
    },
    schema: [], // No options
  },
  create(context) {
    return {
      Program() {
        const sourceCode = context.sourceCode;
        const comments = sourceCode.getAllComments();

        // Stack to track conditional directives
        const directiveStack: { type: string, node: ESLintComment }[] = [];

        // Analyze each comment for directives
        comments.forEach(comment => {
          const commentText = comment.value;
          const match = DIRECTIVE_PATTERN.exec(commentText);

          if (!match) return;

          const directiveType = match[1];

          if (directiveType.startsWith('if')) {
            // Push opening directive onto stack
            directiveStack.push({ type: directiveType, node: {
              value: comment.value,
              type: comment.type,
              range: comment.range
            } });
          } else if (directiveType === 'else') {
            // Check if there's a matching if
            if (directiveStack.length === 0 || !directiveStack[directiveStack.length - 1].type.startsWith('if')) {
              context.report({
                message: 'Unexpected #else without matching #if',
                loc: {
                  start: { line: comment.loc?.start.line || 0, column: comment.loc?.start.column || 0 },
                  end: { line: comment.loc?.end.line || 0, column: comment.loc?.end.column || 0 }
                }
              });
            }
          } else if (directiveType === 'endif') {
            // Check if there's a matching if or else
            if (directiveStack.length === 0) {
              context.report({
                message: 'Unexpected #endif without matching #if',
                loc: {
                  start: { line: comment.loc?.start.line || 0, column: comment.loc?.start.column || 0 },
                  end: { line: comment.loc?.end.line || 0, column: comment.loc?.end.column || 0 }
                }
              });
            } else {
              // Pop the last directive (should be if or else)
              directiveStack.pop();
            }
          }
        });

        // Report any unclosed directives
        directiveStack.forEach(directive => {
          const comment = comments.find(c =>
            c.value === directive.node.value &&
            c.type === directive.node.type
          );

          if (comment) {
            context.report({
              message: `Unclosed conditional directive #${directive.type}`,
              loc: {
                start: { line: comment.loc?.start.line || 0, column: comment.loc?.start.column || 0 },
                end: { line: comment.loc?.end.line || 0, column: comment.loc?.end.column || 0 }
              }
            });
          }
        });
      }
    };
  }
};

/**
 * Export the ESLint plugin with processor and rules
 */
export default {
  processors: {
    '.js': processor,
    '.jsx': processor,
    '.ts': processor,
    '.tsx': processor,
    '.vue': processor,
  },
  rules: {
    'balanced-directives': unbalancedDirectivesRule,
  },
  configs: {
    recommended: {
      plugins: ['conditional-loader'],
      rules: {
        'conditional-loader/balanced-directives': 'error',
      },
    },
  },
};
