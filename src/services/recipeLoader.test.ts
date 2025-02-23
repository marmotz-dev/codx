import { loadRecipe } from '@/services/recipeLoader';
import { MockCleaner, mockModule } from '@/test-helpers/mockModule';
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test';
import { existsSync } from 'fs';
import { resolve } from 'path';

describe('RecipeLoader', () => {
  let cleanFsMock: MockCleaner;
  let cleanFsPromiseMock: MockCleaner;

  beforeEach(async () => {
    cleanFsMock = await mockModule('fs', () => ({
      existsSync: jest.fn().mockResolvedValue(true),
    }));

    cleanFsPromiseMock = await mockModule('fs/promises', () => ({
      readFile: jest.fn().mockResolvedValue('recipe:\n  - log:\n    - text: "test"'),
    }));
  });

  afterEach(() => {
    cleanFsMock();
    cleanFsPromiseMock();
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
    (existsSync as jest.Mock).mockReturnValue(false);
    const rootDir = resolve('.');

    expect(loadRecipe('unknown-recipe.yml')).rejects.toThrow(`Recipe file not found: ${rootDir}/unknown-recipe.yml`);
  });
});
