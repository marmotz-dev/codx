import { CONSOLE_INFO_NAME } from '@/actions/console/console.const';
import { PACKAGES_INSTALL_NAME } from '@/actions/packages/install.const';
import { actionsHandler } from '@/actionsHandler';
import { PackageManagerService } from '@/services/packageManager';
import { AnyAction, Recipe } from '@/services/recipe.type';
import { recipeRunner } from '@/services/recipeRunner';
import { argsToContext } from '@/test-helpers/actionContext';
import { mockModule } from '@/test-helpers/mockModule';
import { describe, expect, it, mock, spyOn } from 'bun:test';

describe('RecipeRunner', () => {
  describe('executeAction', () => {
    it('should execute a known action successfully', async () => {
      const mockHandler = mock(() => Promise.resolve());
      const action: AnyAction = {
        [CONSOLE_INFO_NAME]: ['foo'],
      };

      // Temporarily replace the real handler
      const originalHandler = actionsHandler[CONSOLE_INFO_NAME];
      actionsHandler[CONSOLE_INFO_NAME] = mockHandler;

      try {
        await recipeRunner['executeAction'](action, '');
        expect(mockHandler).toHaveBeenCalledWith(argsToContext(['foo']));
      } finally {
        // Restore the original handler
        actionsHandler[CONSOLE_INFO_NAME] = originalHandler;
      }
    });

    it('should throw an error for an unknown action', async () => {
      const unknownAction: AnyAction = {
        unknown: { data: 'test' },
      } as never;

      expect(recipeRunner['executeAction'](unknownAction, '')).rejects.toThrow('Unknown action: unknown');
    });
  });

  describe('executeRecipe', () => {
    it('should execute all actions in a recipe sequentially', async () => {
      PackageManagerService.getInstance().setPackageManager('bun');

      const mockConsoleInfoHandler = mock(() => Promise.resolve());
      const mockPackagesInstallHandler = mock(() => Promise.resolve());

      const recipe: Recipe = {
        recipe: [{ [CONSOLE_INFO_NAME]: ['info'] }, { [PACKAGES_INSTALL_NAME]: { dependencies: ['lodash'] } }],
      };

      // Temporarily replace the real handlers
      const originalConsoleLogHandler = actionsHandler[CONSOLE_INFO_NAME];
      const originalPackagesInstallHandler = actionsHandler[PACKAGES_INSTALL_NAME];
      actionsHandler[CONSOLE_INFO_NAME] = mockConsoleInfoHandler;
      actionsHandler[PACKAGES_INSTALL_NAME] = mockPackagesInstallHandler;

      try {
        await recipeRunner['executeRecipe'](recipe, '');

        expect(mockConsoleInfoHandler).toHaveBeenCalledWith(argsToContext(['info']));
        expect(mockPackagesInstallHandler).toHaveBeenCalledWith(argsToContext({ dependencies: ['lodash'] }));
      } finally {
        // Restore the original handlers
        actionsHandler[CONSOLE_INFO_NAME] = originalConsoleLogHandler;
        actionsHandler[PACKAGES_INSTALL_NAME] = originalPackagesInstallHandler;
      }
    });
  });

  describe('run', () => {
    it('should load and execute a recipe from a valid YAML file', async () => {
      const mockRecipe = {
        recipe: [{ [CONSOLE_INFO_NAME]: ['Test log message'] }],
      };
      const mockRecipeDirectory = '/mock/recipe/directory';

      const loadRecipeMock = mock(() =>
        Promise.resolve({
          recipe: mockRecipe,
          recipeDirectory: mockRecipeDirectory,
        }),
      );
      const cleanRecipeLoaderMocker = await mockModule('@/services/recipeLoader', () => ({
        loadRecipe: loadRecipeMock,
      }));

      const executeRecipeMock = spyOn(recipeRunner as any, 'executeRecipe').mockImplementation(() => Promise.resolve());

      await recipeRunner.run('test-recipe.yml');

      expect(loadRecipeMock).toHaveBeenCalledWith('test-recipe.yml');
      expect(executeRecipeMock).toHaveBeenCalledWith(mockRecipe, mockRecipeDirectory);

      cleanRecipeLoaderMocker();
    });

    it('should propagate errors from loadRecipe', async () => {
      const loadRecipeMock = mock(() => {
        throw new Error('Failed to load recipe');
      });
      const cleanRecipeLoaderMocker = await mockModule('@/services/recipeLoader', () => ({
        loadRecipe: loadRecipeMock,
      }));

      expect(recipeRunner.run('error-recipe.yml')).rejects.toThrow('Failed to load recipe');

      cleanRecipeLoaderMocker();
    });
  });
});
