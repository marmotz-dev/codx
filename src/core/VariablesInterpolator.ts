import { ConditionEvaluator } from '@/core/ConditionEvaluator';
import { Utils } from '@/core/Utils';
import { Inject } from '@/di/InjectDecorator';

export class VariablesInterpolator {
  constructor(@Inject(ConditionEvaluator) private readonly conditionEvaluator: ConditionEvaluator) {}

  /**
   * Interpolates variables and conditional blocks in the given text
   *
   * @param input The text containing variables and conditional blocks
   * @param variables Record of variables to be used for interpolation
   * @returns Text with variables interpolated and conditionals evaluated
   */
  public interpolate(input: string, variables: Record<string, any>): string {
    if (!input) {
      return input;
    }

    variables = Utils.flatObject(variables);

    // First, process conditional blocks (if/else)
    let result = this.processIfBlocks(input, variables);

    // Then replace simple variable placeholders
    result = this.processVariables(result, variables);

    return result;
  }

  /**
   * Processes conditional blocks in the format {{if CONDITION}}...{{else}}...{{/if}}
   */
  private processIfBlocks(input: string, variables: Record<string, boolean | number | string>): string {
    // Regular expression for matching conditional blocks
    // This matches if blocks with or without else parts
    const ifBlockRegex = /\{\{if\s+(.+?)}}([\s\S]*?)(?:\{\{else}}([\s\S]*?))?\{\{\/if}}/g;

    let result = input;
    let position = 0;

    // Continue processing until input contain '{{if'
    while (result.includes('{{if') || position > result.length) {
      const previousResult = result;

      // Find innermost if blocks (those that don't contain other if blocks)
      result =
        result.slice(0, position) +
        result.slice(position).replace(ifBlockRegex, (match, condition, ifContent, elseContent = '') => {
          // Skip this replacement if the block contains nested if blocks
          if (ifContent.includes('{{if') || elseContent.includes('{{if')) {
            return match;
          }

          return this.conditionEvaluator.evaluate(condition, variables) ? ifContent : elseContent;
        });

      if (result === previousResult) {
        // move forward one character to try to find an if block without and if/else block inside
        position++;
      } else {
        // a replacement has been made, we go back to the start
        position = 0;
      }
    }

    return result;
  }

  /**
   * Replaces variables in the format {VARIABLE_NAME} with their values
   */
  private processVariables(input: string, variables: Record<string, boolean | number | string>): string {
    return input.replace(/\{(\$?[a-zA-Z0-9-_./]+)}/g, (match, variableName) => {
      if (variableName in variables) {
        const value = variables[variableName];

        return value !== undefined ? String(value) : '';
      }

      return match; // Keep the original text if the variable doesn't exist
    });
  }
}
