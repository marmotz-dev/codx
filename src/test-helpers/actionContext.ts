import { ActionContext } from '@/actions/action.type';

export function createActionContext<T>(partialContext: Partial<ActionContext<T>> = {}): ActionContext<T> {
  return {
    args: {} as T,
    projectDirectory: process.cwd(),
    recipeDirectory: '',
    ...partialContext,
  };
}

export function argsToContext<T>(partialArgs: Partial<T>): ActionContext<T> {
  return createActionContext<T>({ args: partialArgs as T });
}
