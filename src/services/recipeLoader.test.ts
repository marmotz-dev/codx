import { loadRecipe } from '@/services/recipeLoader';
import { MockCleaner, mockModule } from '@/test-helpers/mockModule';
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test';
import { exists } from 'fs/promises';
import { resolve } from 'path';

describe('RecipeLoader', () => {
  let cleanFsMock: MockCleaner;

  beforeEach(async () => {
    // Mock filesystem operations
    cleanFsMock = await mockModule('fs/promises', () => ({
      readFile: jest.fn().mockResolvedValue('recipe:\n  - log:\n    - text: "test"'),
      exists: jest.fn().mockResolvedValue(true),
    }));
  });

  afterEach(() => {
    cleanFsMock();
  });

  it('should load a recipe from a local file', async () => {
    const recipe = await loadRecipe('test.yml');
    expect(recipe).toBeDefined();
    expect(recipe).toHaveProperty('recipe');
  });

  it('should not load a recipe from a remote package', async () => {
    expect(loadRecipe('test-recipe')).rejects.toThrow('Remote packages are not supported');
  });

  it('should throw an error if recipe.yml was not found', async () => {
    (exists as jest.Mock).mockResolvedValue(false);
    const rootDir = resolve('.');

    expect(loadRecipe('unknown-recipe.yml')).rejects.toThrow(`Recipe file not found: ${rootDir}/unknown-recipe.yml`);
  });
});
