import { Logger } from '@/core/Logger';
import { PackageManagerDetector, PackageManagers } from '@/core/PackageManagerDetector';
import { RecipeLoader } from '@/core/RecipeLoader';
import { RecipeRunner } from '@/core/RecipeRunner';
import { diContainer } from '@/di/Container';
import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { RunActionOptions, RunCommand } from './RunCommand';

describe('RunCommand', () => {
  let runCommand: RunCommand;
  let mockLogger: Logger;
  let mockPackageManagerDetector: PackageManagerDetector;
  let mockRecipeLoader: RecipeLoader;
  let mockRecipeRunner: RecipeRunner;

  const mockRecipe = { name: 'test-recipe' };

  beforeEach(() => {
    // Setup mocks
    mockLogger = {
      setVerbose: mock(() => {}),
    } as unknown as Logger;

    mockPackageManagerDetector = {
      detect: mock(() => {}),
    } as unknown as PackageManagerDetector;

    mockRecipeLoader = {
      loadByNameOrPath: mock(async () => mockRecipe),
    } as unknown as RecipeLoader;

    mockRecipeRunner = {
      run: mock(async () => {}),
    } as unknown as RecipeRunner;

    diContainer.register(Logger, mockLogger);
    diContainer.register(PackageManagerDetector, mockPackageManagerDetector);
    diContainer.register(RecipeLoader, mockRecipeLoader);
    diContainer.register(RecipeRunner, mockRecipeRunner);

    runCommand = diContainer.get(RunCommand);
  });

  afterEach(() => {
    mock.restore();
  });

  test('doExecute calls all required dependencies with correct parameters', async () => {
    // Arrange
    const recipePath = 'test-recipe';
    const options: RunActionOptions = {
      projectDir: '/path/to/project',
      verbose: false,
    };

    // Act
    await runCommand.doExecute(recipePath, options);

    // Assert
    expect(mockLogger.setVerbose).not.toHaveBeenCalled();
    expect(mockPackageManagerDetector.detect).toHaveBeenCalledWith(undefined);
    expect(mockRecipeLoader.loadByNameOrPath).toHaveBeenCalledWith(recipePath);
    expect(mockRecipeRunner.run).toHaveBeenCalledWith(mockRecipe, options.projectDir);
  });

  test('doExecute sets logger to verbose mode when verbose option is true', async () => {
    // Arrange
    const recipePath = 'test-recipe';
    const options: RunActionOptions = {
      projectDir: '/path/to/project',
      verbose: true,
    };

    // Act
    await runCommand.doExecute(recipePath, options);

    // Assert
    expect(mockLogger.setVerbose).toHaveBeenCalled();
  });

  test('doExecute passes package manager option to detector when specified', async () => {
    // Arrange
    const recipePath = 'test-recipe';
    const options: RunActionOptions = {
      projectDir: '/path/to/project',
      verbose: false,
      pm: 'npm' as PackageManagers,
    };

    // Act
    await runCommand.doExecute(recipePath, options);

    // Assert
    expect(mockPackageManagerDetector.detect).toHaveBeenCalledWith('npm');
  });

  test('doExecute defaults verbose to false if not provided', async () => {
    // Arrange
    const recipePath = 'test-recipe';
    const options = {
      projectDir: '/path/to/project',
    } as RunActionOptions;

    // Act
    await runCommand.doExecute(recipePath, options);

    // Assert
    expect(mockLogger.setVerbose).not.toHaveBeenCalled();
    expect(options.verbose).toBe(false);
  });
});
