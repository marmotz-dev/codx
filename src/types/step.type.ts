export type Step<T> = (context: StepContext<T>) => Promise<void>;

export type StepContext<T> = {
  args: T;
  recipeDirectory: string;
  projectDirectory: string;
};
