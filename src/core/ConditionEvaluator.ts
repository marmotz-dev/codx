import { Utils } from '@/core/Utils';
import { compileExpression } from 'filtrex';

/**
 * Class responsible for evaluating conditions
 */
export class ConditionEvaluator {
  evaluate(condition: string, variables: Record<string, any>): boolean {
    try {
      const check = compileExpression(condition, {
        customProp: this.customProp,
      });

      return check({
        ...Utils.flatObject(variables),
        true: true,
        false: false,
      });
    } catch {
      return false;
    }
  }

  private customProp(name: string, get: (name: string) => any, variables: Record<string, any>): any {
    return variables[name] !== undefined ? get(name) : undefined;
  }
}
