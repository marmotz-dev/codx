import { loadRecipe } from '@/services/recipeLoader';
import { stepsHandler } from '@/stepsHandler';
import { AnyStep, Recipe, StepNames } from '@/types/recipe.type';

export async function executeRecipeByNameOrPath(recipeNameOrPath: string): Promise<void> {
  const { recipe, recipeDirectory } = await loadRecipe(recipeNameOrPath);

  await executeRecipe(recipe, recipeDirectory);
}

export async function executeRecipe(recipe: Recipe, recipeDirectory: string): Promise<void> {
  for (const step of recipe.recipe) {
    await executeStep(step, recipeDirectory);
  }
}

export async function executeStep(step: AnyStep, recipeDirectory: string): Promise<void> {
  const stepName = Object.keys(step)[0] as StepNames;
  const handler = stepsHandler[stepName];

  if (!handler) {
    throw new Error(`Unknown step: ${stepName}`);
  }

  const args: never = (step as Record<StepNames, never>)[stepName];
  await handler({
    args,
    projectDirectory: process.cwd(),
    recipeDirectory,
  });
}
