import { actionsHandler } from '@/actionsHandler';
import { ActionNames } from '@/actionsHandler.type';
import { AnyAction, Recipe } from '@/services/recipe.type';
import { loadRecipe } from '@/services/recipeLoader';

class RecipeRunner {
  async run(recipeNameOrPath: string): Promise<void> {
    const { recipe, recipeDirectory } = await loadRecipe(recipeNameOrPath);

    await this.executeRecipe(recipe, recipeDirectory);
  }

  private async executeAction(action: AnyAction, recipeDirectory: string): Promise<void> {
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

  private async executeRecipe(recipe: Recipe, recipeDirectory: string): Promise<void> {
    for (const action of recipe.recipe) {
      await this.executeAction(action, recipeDirectory);
    }
  }
}

export const recipeRunner = new RecipeRunner();
