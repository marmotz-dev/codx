import { actionsHandler } from '@/actionsHandler';
import { PackageManagerService } from '@/services/packageManager';
import { executeAction, executeRecipe, executeRecipeByNameOrPath } from '@/services/recipeRunner';
import { argsToContext } from '@/tests/actionContext';
import { AnyAction, Recipe } from '@/types/recipe.type';
import { describe, expect, it, mock } from 'bun:test';

describe('RecipeRunner', () => {
  describe('executeAction', () => {
    it('should execute a known action successfully', async () => {
      const mockHandler = mock(() => Promise.resolve());
      const action: AnyAction = {
        log: ['foo'],
      };

      // Temporarily replace the real handler
      const originalHandler = actionsHandler.log;
      actionsHandler.log = mockHandler;

      try {
        await executeAction(action, '');
        expect(mockHandler).toHaveBeenCalledWith(argsToContext(['foo']));
      } finally {
        // Restore the original handler
        actionsHandler.log = originalHandler;
      }
    });

    it('should throw an error for an unknown action', async () => {
      const unknownAction: AnyAction = {
        unknown: { data: 'test' },
      } as never;

      expect(executeAction(unknownAction, '')).rejects.toThrow('Unknown action: unknown');
    });
  });

  describe('executeRecipe', () => {
    it('should execute all actions in a recipe sequentially', async () => {
      PackageManagerService.getInstance().setPackageManager('bun');

      const mockLogHandler = mock(() => Promise.resolve());
      const mockAddPackagesHandler = mock(() => Promise.resolve());

      const recipe: Recipe = {
        recipe: [{ log: ['log'] }, { addPackages: { dependencies: ['lodash'] } }],
      };

      // Temporarily replace the real handlers
      const originalLogHandler = actionsHandler.log;
      const originalAddPackagesHandler = actionsHandler.addPackages;
      actionsHandler.log = mockLogHandler;
      actionsHandler.addPackages = mockAddPackagesHandler;

      try {
        await executeRecipe(recipe, '');

        expect(mockLogHandler).toHaveBeenCalledWith(argsToContext(['log']));
        expect(mockAddPackagesHandler).toHaveBeenCalledWith(argsToContext({ dependencies: ['lodash'] }));
      } finally {
        // Restore the original handlers
        actionsHandler.log = originalLogHandler;
        actionsHandler.addPackages = originalAddPackagesHandler;
      }
    });
  });

  describe('executeRecipeByNameOrPath', () => {
    it('should load and execute a recipe from a valid YAML file', async () => {
      const mockRecipe = {
        recipe: [{ log: ['Test log message'] }],
      };
      const mockRecipeDirectory = '/mock/recipe/directory';

      const loadRecipeMock = mock(() =>
        Promise.resolve({
          recipe: mockRecipe,
          recipeDirectory: mockRecipeDirectory,
        }),
      );
      mock.module('./recipeLoader', () => ({
        loadRecipe: loadRecipeMock,
      }));

      const executeRecipeMock = mock(() => Promise.resolve());
      mock.module('./recipeRunner', () => ({
        executeRecipe: executeRecipeMock,
      }));

      await executeRecipeByNameOrPath('test-recipe.yml');

      expect(loadRecipeMock).toHaveBeenCalledWith('test-recipe.yml');
      expect(executeRecipeMock).toHaveBeenCalledWith(mockRecipe, mockRecipeDirectory);
    });

    it('should propagate errors from loadRecipe', async () => {
      const loadRecipeMock = mock(() => {
        throw new Error('Failed to load recipe');
      });
      mock.module('./recipeLoader', () => ({
        loadRecipe: loadRecipeMock,
      }));

      expect(executeRecipeByNameOrPath('error-recipe.yml')).rejects.toThrow('Failed to load recipe');
    });
  });
});
