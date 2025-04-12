import { compileExpression, useDotAccessOperatorAndOptionalChaining } from 'filtrex';

/**
 * Class responsible for evaluating conditions
 */
export class ConditionEvaluator {
  evaluate(condition: string, variables: Record<string, any>): boolean {
    try {
      const check = compileExpression(condition, {
        customProp: useDotAccessOperatorAndOptionalChaining,
      });

      return check({
        ...variables,
        true: true,
        false: false,
      });
    } catch {
      return false;
    }
  }
}
