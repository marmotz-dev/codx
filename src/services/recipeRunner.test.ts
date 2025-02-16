import { PackageManagerService } from '@/services/packageManager';
import { executeRecipe, executeRecipeByNameOrPath, executeStep } from '@/services/recipeRunner';
import { stepsHandler } from '@/stepsHandler';
import { argsToContext } from '@/tests/stepContext';
import { AnyStep, Recipe } from '@/types/recipe.type';
import { describe, expect, it, mock } from 'bun:test';

describe('RecipeRunner', () => {
  describe('executeStep', () => {
    it('should execute a known step successfully', async () => {
      const mockHandler = mock(() => Promise.resolve());
      const step: AnyStep = {
        log: ['foo'],
      };

      // Temporarily replace the real handler
      const originalHandler = stepsHandler.log;
      stepsHandler.log = mockHandler;

      try {
        await executeStep(step, '');
        expect(mockHandler).toHaveBeenCalledWith(argsToContext(['foo']));
      } finally {
        // Restore the original handler
        stepsHandler.log = originalHandler;
      }
    });

    it('should throw an error for an unknown step', async () => {
      const unknownStep: AnyStep = {
        unknown: { data: 'test' },
      } as never;

      expect(executeStep(unknownStep, '')).rejects.toThrow('Unknown step: unknown');
    });
  });

  describe('executeRecipe', () => {
    it('should execute all steps in a recipe sequentially', async () => {
      PackageManagerService.getInstance().setPackageManager('bun');

      const mockLogHandler = mock(() => Promise.resolve());
      const mockAddPackagesHandler = mock(() => Promise.resolve());

      const recipe: Recipe = {
        recipe: [{ log: ['log'] }, { addPackages: { dependencies: ['lodash'] } }],
      };

      // Temporarily replace the real handlers
      const originalLogHandler = stepsHandler.log;
      const originalAddPackagesHandler = stepsHandler.addPackages;
      stepsHandler.log = mockLogHandler;
      stepsHandler.addPackages = mockAddPackagesHandler;

      try {
        await executeRecipe(recipe, '');

        expect(mockLogHandler).toHaveBeenCalledWith(argsToContext(['log']));
        expect(mockAddPackagesHandler).toHaveBeenCalledWith(argsToContext({ dependencies: ['lodash'] }));
      } finally {
        // Restore the original handlers
        stepsHandler.log = originalLogHandler;
        stepsHandler.addPackages = originalAddPackagesHandler;
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
