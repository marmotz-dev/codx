import { Logger } from '@/core/Logger.js';
import { Recipe } from '@/core/Recipe.schema';
import { RecipeDirectory } from '@/core/RecipeDirectory';
import { RecipeLoader } from '@/core/RecipeLoader';
import { MockCleaner, mockModule } from '@/testHelpers/mockModule';
import { afterEach, beforeEach, describe, expect, Mock, mock, spyOn, test } from 'bun:test';
import chalk from 'chalk';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { createWriteStream } from 'node:fs';
import Stream, { Readable } from 'node:stream';
import { extract } from 'tar';

describe('RecipeLoader', () => {
  let recipeLoader: RecipeLoader;
  let mockLogger: Logger;
  let mockRecipeDirectory: RecipeDirectory;
  let cleanFsMock: MockCleaner;
  let cleanFsPromisesMock: MockCleaner;
  let cleanPathMock: MockCleaner;
  let cleanYamlMock: MockCleaner;
  let cleanTarMock: MockCleaner;
  let mockPathResolve: Mock<(path: any) => any>;
  let mockPathJoin: Mock<(...paths: any[]) => any>;

  beforeEach(async () => {
    cleanFsMock = await mockModule('fs', () => ({
      existsSync: mock(),
      createWriteStream: mock(() => ({
        on: mock(),
        close: mock(),
      })),
      mkdirSync: mock(),
    }));

    cleanFsPromisesMock = await mockModule('fs/promises', () => ({
      readFile: mock(),
      mkdir: mock(),
    }));

    cleanPathMock = await mockModule('path', () => ({
      resolve: (mockPathResolve = mock((path) => path)),
      dirname: mock((path) => `${path}-dirname`),
      join: (mockPathJoin = mock((...paths) => paths.join('/'))),
    }));

    cleanYamlMock = await mockModule('js-yaml', () => ({
      load: mock(),
    }));

    cleanTarMock = await mockModule('tar/extract', () => ({
      extract: mock(),
    }));

    mockLogger = {
      info: mock(),
      error: mock(),
      warn: mock(),
      message: mock(),
    } as unknown as Logger;

    mockRecipeDirectory = {
      init: mock(),
      get: mock(),
    } as unknown as RecipeDirectory;

    recipeLoader = new RecipeLoader(mockLogger, mockRecipeDirectory);
  });

  afterEach(() => {
    cleanFsMock();
    cleanFsPromisesMock();
    cleanPathMock();
    cleanYamlMock();
    cleanTarMock();
  });

  test('should load recipe from a valid YAML file', async () => {
    const yamlPath = '/path/to/recipe.yml';
    const mockFileContent = 'mock: file content';
    const mockRecipe = {
      description: '',
      steps: [],
    } satisfies Recipe;

    (existsSync as Mock<() => true>).mockReturnValue(true);
    (readFile as unknown as Mock<() => Promise<string>>).mockResolvedValue(mockFileContent);
    (load as Mock<() => Recipe>).mockReturnValue(mockRecipe);

    const recipe = await recipeLoader.loadByNameOrPath(yamlPath);

    expect(existsSync).toHaveBeenCalledWith(yamlPath);
    expect(readFile).toHaveBeenCalledWith(yamlPath, 'utf8');
    expect(load).toHaveBeenCalledWith(mockFileContent);
    expect(recipe).toEqual(mockRecipe);
    expect(mockLogger.message).toHaveBeenCalledWith(`Recipe file............. : ${chalk.gray(yamlPath)}`);
  });

  test('should load recipe from a remote package', async () => {
    const recipeName = 'test-recipe';
    const packageName = 'test-recipe-codx-recipe';
    const extractedDir = '/mock/path/to/package';
    const recipePath = '/mock/path/to/package/recipe.yml';
    const mockFileContent = 'mock: file content';
    const mockRecipe = {
      description: '',
      steps: [],
    } satisfies Recipe;

    // Mock the fetchJson method to return a package info object
    const mockPackageInfo = {
      dist: {
        tarball: 'https://registry.npmjs.org/codx-test-recipe-recipe/-/test-recipe-codx-recipe-1.0.0.tgz',
      },
    };

    // Use spyOn to mock the private methods
    const fetchJsonSpy = spyOn(recipeLoader as any, 'fetchJson').mockResolvedValue(mockPackageInfo);
    const downloadFileSpy = spyOn(recipeLoader as any, 'downloadFile').mockResolvedValue(undefined);
    const extractTarballSpy = spyOn(recipeLoader as any, 'extractTarball').mockResolvedValue(undefined);

    // Mock path.join to return the expected paths
    mockPathJoin.mockImplementation((...paths) => {
      if (paths.includes('package')) {
        return extractedDir;
      }
      if (paths.includes('recipe.yml')) {
        return recipePath;
      }

      return paths.join('/');
    });

    (existsSync as Mock<(path: string) => boolean>).mockImplementation((path) => path === recipePath);
    (readFile as unknown as Mock<() => Promise<string>>).mockResolvedValue(mockFileContent);
    (load as Mock<() => Recipe>).mockReturnValue(mockRecipe);

    const recipe = await recipeLoader.loadByNameOrPath(recipeName);

    expect(fetchJsonSpy).toHaveBeenCalledWith(`https://registry.npmjs.org/${packageName}/latest`);
    expect(downloadFileSpy).toHaveBeenCalled();
    expect(extractTarballSpy).toHaveBeenCalled();
    expect(mockRecipeDirectory.init).toHaveBeenCalledWith(extractedDir);
    expect(existsSync).toHaveBeenCalledWith(recipePath);
    expect(readFile).toHaveBeenCalledWith(recipePath, 'utf8');
    expect(load).toHaveBeenCalledWith(mockFileContent);
    expect(recipe).toEqual(mockRecipe);
    expect(mockLogger.message).toHaveBeenCalledWith(`Recipe package.......... : ${chalk.gray(packageName)}`);
    expect(mockLogger.message).toHaveBeenCalledWith(`Recipe file............. : ${chalk.gray(recipePath)}`);
  });

  test('should throw error when recipe file does not exist', async () => {
    const yamlPath = '/path/to/nonexistent.yml';
    (existsSync as Mock<() => false>).mockReturnValue(false);

    expect(recipeLoader.loadByNameOrPath(yamlPath)).rejects.toThrow(`Recipe file not found: ${yamlPath}`);
  });

  describe('loadRecipe', () => {
    test('should throw error when file content cannot be loaded', async () => {
      const recipePath = '/path/to/recipe.yml';

      (readFile as unknown as Mock<() => Promise<string>>).mockRejectedValue(new Error('Read file error'));

      expect(recipeLoader['loadRecipe'](recipePath)).rejects.toThrow('Failed to load recipe: Read file error');
    });

    test('should throw error when recipe fails schema validation', async () => {
      const recipePath = '/path/to/recipe.yml';
      const invalidRecipe = {
        // Missing required fields to trigger schema validation error
      } as Recipe;

      (readFile as unknown as Mock<() => Promise<string>>).mockResolvedValue('mock content');
      (load as Mock<() => Recipe>).mockReturnValue(invalidRecipe);

      expect(recipeLoader['loadRecipe'](recipePath)).rejects.toThrow('Invalid recipe schema');
    });
  });

  describe('resolveRecipePath', () => {
    test('should resolve absolute path correctly', () => {
      const recipePath = '/absolute/path/to/recipe.yml';

      const resolvedPath = recipeLoader['resolveRecipePath'](recipePath);

      expect(resolvedPath).toBe(recipePath);
    });

    test('should throw error for invalid path', () => {
      const invalidPath = '/invalid/path/with/invalid/chars';
      mockPathResolve.mockImplementation(() => {
        throw new Error('Read file error');
      });

      expect(() => recipeLoader['resolveRecipePath'](invalidPath)).toThrow('Failed to find recipe');
    });
  });

  describe('parsePackageVersion', () => {
    test('should parse package name without version', () => {
      const result = (recipeLoader as any).parsePackageVersion('my-recipe');
      expect(result).toEqual({ name: 'my-recipe', version: 'latest' });
    });

    test('should parse package name with version', () => {
      const result = (recipeLoader as any).parsePackageVersion('my-recipe@1.0.0');
      expect(result).toEqual({ name: 'my-recipe', version: '1.0.0' });
    });
  });

  describe('getPackageName', () => {
    test('should return the correct package name', () => {
      const result = (recipeLoader as any).getPackageName('my-recipe');
      expect(result).toBe('my-recipe-codx-recipe');
    });
  });

  describe('extractTarball', () => {
    test('should extract a tarball successfully', async () => {
      // (extract as unknown as Mock<any>).mockResolvedValue(undefined);
      const tarballPath = '/tmp/package.tgz';
      const destination = '/tmp/extract-dir';

      await recipeLoader['extractTarball'](tarballPath, destination);

      expect(extract).toHaveBeenCalledWith({
        file: tarballPath,
        cwd: destination,
      });
    });
  });

  // Tests for downloadFile and fetchJson methods
  describe('downloadFile', () => {
    test('should download a file from URL successfully', async () => {
      // Mock the fetch API response
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        body: new Stream(),
      };

      globalThis.fetch = mock(() => Promise.resolve(mockResponse)) as unknown as typeof fetch;

      const mockReadableStream = {
        pipe: mock(),
      };
      Readable.from = mock(() => mockReadableStream) as unknown as typeof Readable.from;

      const mockFileStreamHandlers: any = {};
      const mockFileStream = {
        on: mock((event, callback) => {
          mockFileStreamHandlers[event] = callback;

          return mockFileStream;
        }),
        close: mock(),
      };
      (createWriteStream as Mock<any>).mockReturnValue(mockFileStream);

      const url = 'https://example.com/file.tgz';
      const destination = '/tmp/downloaded-file.tgz';

      const downloadPromise = recipeLoader['downloadFile'](url, destination);

      setTimeout(() => {
        if (mockFileStreamHandlers['finish']) {
          mockFileStreamHandlers['finish']();
        }
      }, 0);

      await downloadPromise;

      expect(global.fetch).toHaveBeenCalledWith(url);
      expect(Readable.from).toHaveBeenCalledWith(mockResponse.body);
      expect(mockReadableStream.pipe).toHaveBeenCalled();
      expect(createWriteStream).toHaveBeenCalledWith(destination);
      expect(mockFileStream.close).toHaveBeenCalled();
    });

    test('should throw an error when fetch response is not ok', async () => {
      // Mock fetch to return an error response
      const mockErrorResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      };

      globalThis.fetch = mock(() => Promise.resolve(mockErrorResponse)) as unknown as typeof fetch;

      const url = 'https://example.com/nonexistent-file.tgz';
      const destination = '/tmp/downloaded-file.tgz';

      // The downloadFile method should throw an error
      expect(recipeLoader['downloadFile'](url, destination)).rejects.toThrow('HTTP Error: 404 Not Found');

      expect(global.fetch).toHaveBeenCalledWith(url);
    });

    test('should handle file stream errors correctly', async () => {
      // Mock the fetch API response
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        body: new Stream(),
      };

      globalThis.fetch = mock(() => Promise.resolve(mockResponse)) as unknown as typeof fetch;

      // Mock file stream with error event
      const mockFileStream = {
        on: mock((event, callback) => {
          if (event === 'error') {
            callback(new Error('File write error'));
          }

          return mockFileStream;
        }),
        close: mock(),
      };

      (createWriteStream as Mock<any>).mockReturnValue(mockFileStream);

      // Mock Readable.from
      const mockReadableStream = {
        pipe: mock(),
      };
      Readable.from = mock(() => mockReadableStream) as unknown as typeof Readable.from;

      const url = 'https://example.com/file.tgz';
      const destination = '/tmp/downloaded-file.tgz';

      expect(recipeLoader['downloadFile'](url, destination)).rejects.toThrow('File write error');
    });
  });

  describe('fetchJson', () => {
    test('should fetch and parse JSON successfully', async () => {
      const mockJsonData = { name: 'test-package', version: '1.0.0' };

      // Mock the fetch API response
      const mockResponse = {
        ok: true,
        json: mock(() => Promise.resolve(mockJsonData)),
      };

      globalThis.fetch = mock(() => Promise.resolve(mockResponse)) as unknown as typeof fetch;

      const url = 'https://registry.npmjs.org/test-package/1.0.0';

      const result = await recipeLoader['fetchJson'](url);

      expect(global.fetch).toHaveBeenCalledWith(url);
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockJsonData);
    });

    test('should throw an error when fetch fails', async () => {
      // Mock fetch to throw an error
      global.fetch = mock(() => Promise.reject(new Error('Network error')));

      const url = 'https://registry.npmjs.org/test-package/1.0.0';

      expect(recipeLoader['fetchJson'](url)).rejects.toThrow('Network error');
    });

    test('should throw an error when response is not ok', async () => {
      // Mock the fetch API response with error
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      };

      globalThis.fetch = mock(() => Promise.resolve(mockResponse)) as unknown as typeof fetch;
      const url = 'https://registry.npmjs.org/nonexistent-package/1.0.0';

      expect(recipeLoader['fetchJson'](url)).rejects.toThrow(`Failed to fetch ${url}: 404 Not Found`);
    });

    test('should throw an error when JSON parsing fails', async () => {
      // Mock response with JSON parsing error
      const mockResponse = {
        ok: true,
        json: mock(() => Promise.reject(new Error('Invalid JSON'))),
      };

      globalThis.fetch = mock(() => Promise.resolve(mockResponse)) as unknown as typeof fetch;
      const url = 'https://registry.npmjs.org/test-package/1.0.0';

      expect(recipeLoader['fetchJson'](url)).rejects.toThrow('Invalid JSON');
    });
  });
});
