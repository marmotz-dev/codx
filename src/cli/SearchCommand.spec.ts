import { Logger } from '@/core/Logger';
import { diContainer } from '@/di/Container';
import { setupConsole } from '@/testHelpers/setupConsole';
import { beforeEach, describe, expect, Mock, mock, spyOn, test } from 'bun:test';
import chalk from 'chalk';
import { SearchActionOptions, SearchCommand } from './SearchCommand';

describe('SearchCommand', () => {
  const { mockConsoleLog } = setupConsole();

  let searchCommand: SearchCommand;
  let loggerSetVerboseSpy: Mock<() => void>;
  let mockFetch: ReturnType<typeof mock>;

  beforeEach(() => {
    mock.restore();
    const logger = diContainer.get(Logger);
    loggerSetVerboseSpy = spyOn(logger, 'setVerbose');

    // Mock fetch
    mockFetch = mock(() => {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            objects: [
              {
                package: {
                  name: 'test-package',
                  description: 'Test description',
                  version: '1.0.0',
                  publisher: { username: 'testuser' },
                  links: { npm: 'https://npmjs.com/package/test-package' },
                },
              },
            ],
            total: 1,
          }),
      });
    });
    globalThis.fetch = mockFetch as unknown as typeof globalThis.fetch;

    searchCommand = diContainer.get(SearchCommand);
  });

  test('doExecute should set verbose mode when option is provided', async () => {
    const options: SearchActionOptions = { verbose: true };
    await searchCommand.doExecute('test', options);

    expect(loggerSetVerboseSpy).toHaveBeenCalled();
  });

  test('doExecute should not set verbose mode when option is false', async () => {
    const options: SearchActionOptions = { verbose: false };
    await searchCommand.doExecute('test', options);

    expect(loggerSetVerboseSpy).not.toHaveBeenCalled();
  });

  test('searchRecipes should fetch packages from npm registry', async () => {
    await searchCommand.doExecute('test', { verbose: false });

    expect(mockFetch).toHaveBeenCalledWith(
      'https://registry.npmjs.org/-/v1/search?text=test%20keyword%3Acodx-recipe&size=100',
    );
  });

  test('searchRecipes should throw an error when no packages are found', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ objects: [], total: 0 }),
      }),
    );

    expect(searchCommand.doExecute('nonexistent', { verbose: false })).rejects.toThrow(
      'No packages found matching "nonexistent"',
    );
  });

  test('searchRecipes should throw an error when API request fails', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      }),
    );

    expect(searchCommand.doExecute('test', { verbose: false })).rejects.toThrow(
      'Failed to search npm packages: 500 Internal Server Error',
    );
  });

  test('displayRecipes should format and display search results', async () => {
    await searchCommand.doExecute('Test', { verbose: false });

    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining(`Search results for "test":`));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('1. test-package'));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Test description'));
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Link: https://npmjs.com/package/test-package'),
    );
    expect(mockConsoleLog).toHaveBeenCalledWith('');
    expect(mockConsoleLog).toHaveBeenCalledWith(chalk.blue('Found 1 package.'));
  });

  test('displayRecipes should handle missing package details gracefully', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            objects: [
              {
                package: {
                  name: 'minimal-package',
                  version: '1.0.0',
                },
              },
            ],
            total: 1,
          }),
      }),
    );

    await searchCommand.doExecute('package', { verbose: false });

    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('1. minimal-package'));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('No description'));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining(chalk.bold('Version:') + ' 1.0.0'));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Link:'));
  });

  test('should handle plural form when multiple packages are found', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            objects: [
              {
                package: { name: 'package1', version: '1.0.0' },
              },
              {
                package: { name: 'package2', version: '2.0.0' },
              },
            ],
            total: 2,
          }),
      }),
    );

    await searchCommand.doExecute('package', { verbose: false });

    expect(mockConsoleLog).toHaveBeenCalledWith(chalk.blue('Found 2 packages.'));
  });
});
