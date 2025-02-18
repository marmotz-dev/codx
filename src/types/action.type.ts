export type Action<T> = (context: ActionContext<T>) => Promise<void>;

export type ActionContext<T> = {
  args: T;
  recipeDirectory: string;
  projectDirectory: string;
};
