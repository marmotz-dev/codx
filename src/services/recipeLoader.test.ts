import { loadRecipe } from '@/services/recipeLoader';
import { beforeEach, describe, expect, mock, test } from 'bun:test';
import { resolve } from 'path';

describe('RecipeLoader', () => {
  const fsMockFunctions = {
    readFileSync: () => 'recipe:\n  - log:\n    - text: "test"',
    existsSync: () => true,
    mkdtempSync: () => '/tmp/test',
    rmSync: () => undefined,
  };

  beforeEach(() => {
    // Mock filesystem operations
    mock.module('fs', () => fsMockFunctions);
  });

  test('should load a recipe from a local file', async () => {
    const recipe = await loadRecipe('test.yml');
    expect(recipe).toBeDefined();
    expect(recipe).toHaveProperty('recipe');
  });

  test('should not load a recipe from a remote package', async () => {
    expect(loadRecipe('test-recipe')).rejects.toThrow('Remote packages are not supported');
  });

  test('should throw an error if recipe.yml was not found', async () => {
    mock.module('fs', () => ({
      ...fsMockFunctions,
      existsSync: (path: string) => !path.endsWith('recipe.yml'),
    }));
    const rootDir = resolve('.');

    expect(loadRecipe('unknown-recipe.yml')).rejects.toThrow(`Recipe file not found: ${rootDir}/unknown-recipe.yml`);
  });
});
