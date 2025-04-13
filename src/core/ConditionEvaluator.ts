import { compileExpression, useDotAccessOperatorAndOptionalChaining } from 'filtrex';

/**
 * Class responsible for evaluating conditions
 */
export class ConditionEvaluator {
  evaluate(condition: string, variables: Record<string, any>): boolean {
    try {
      const check = compileExpression(condition, {
        customProp: useDotAccessOperatorAndOptionalChaining,
        extraFunctions: {
          instanceOf: (o: any, c: any) => {
            if (typeof o !== 'object' || typeof c !== 'string') {
              return false;
            }

            // check if o or parent class is instance of c
            do {
              if (o?.name === c || o?.constructor?.name === c) {
                return true;
              }
            } while ((o = Object.getPrototypeOf(o)));

            return false;
          },
        },
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
