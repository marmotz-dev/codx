import { actionsHandler } from '@/actionsHandler';
import { loadRecipe } from '@/services/recipeLoader';
import { ActionNames, AnyAction, Recipe } from '@/types/recipe.type';

export async function executeRecipeByNameOrPath(recipeNameOrPath: string): Promise<void> {
  const { recipe, recipeDirectory } = await loadRecipe(recipeNameOrPath);

  await executeRecipe(recipe, recipeDirectory);
}

export async function executeRecipe(recipe: Recipe, recipeDirectory: string): Promise<void> {
  for (const action of recipe.recipe) {
    await executeAction(action, recipeDirectory);
  }
}

export async function executeAction(action: AnyAction, recipeDirectory: string): Promise<void> {
  const actionName = Object.keys(action)[0] as ActionNames;
  const handler = actionsHandler[actionName];

  if (!handler) {
    throw new Error(`Unknown action: ${actionName}`);
  }

  const args: never = (action as Record<ActionNames, never>)[actionName];
  await handler({
    args,
    projectDirectory: process.cwd(),
    recipeDirectory,
  });
}
