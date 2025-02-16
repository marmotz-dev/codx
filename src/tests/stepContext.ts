import { StepContext } from '@/types/step.type';

export function createStepContext<T>(partialContext: Partial<StepContext<T>> = {}): StepContext<T> {
  return {
    args: {} as T,
    projectDirectory: process.cwd(),
    recipeDirectory: '',
    ...partialContext,
  };
}

export function argsToContext<T>(partialArgs: Partial<T> = {}): StepContext<T> {
  return createStepContext<T>({ args: partialArgs as T });
}
