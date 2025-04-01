import { FileSystemAction } from '@/actions/fileSystem/FileSystemAction';
import {
  FileSystemActionCopyData,
  FileSystemActionCreateData,
  FileSystemActionData,
  FileSystemActionMoveData,
} from '@/actions/fileSystem/FileSystemAction.schema';
import { CodxError } from '@/core/CodxError';
import { Store } from '@/core/Store';
import { diContainer } from '@/di/Container';
import { MockCleaner, mockModule } from '@/testHelpers/mockModule';
import { setupConsole } from '@/testHelpers/setupConsole';
import { setupWorkingDirectories } from '@/testHelpers/setupWorkingDirectories';
import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import chalk from 'chalk';
import { copyFileSync, existsSync, mkdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

describe('FileSystemAction', () => {
  const { mockRecipeDir, mockProjectDir } = setupWorkingDirectories();
  setupConsole();

  const mockFilePath = 'test/file.txt';
  const mockAbsolutePath = `${mockProjectDir}/${mockFilePath}`;
  const mockContent = 'Test content';
  const mockInterpolatedContent = 'Interpolated test content';
  const mockSourcePath = '{$RECIPE_DIRECTORY}/source/file.txt';
  const mockAbsoluteSourcePath = mockSourcePath.replace('{$RECIPE_DIRECTORY}', mockRecipeDir);
  const mockDestinationPath = 'destination/file.txt';
  const mockAbsoluteDestinationPath = `${mockProjectDir}/${mockDestinationPath}`;

  let mockFsCleaner: MockCleaner;
  let action: FileSystemAction;

  beforeEach(async () => {
    mockFsCleaner = await mockModule('fs', () => ({
      existsSync: mock(),
      writeFileSync: mock(),
      unlinkSync: mock(),
      copyFileSync: mock(),
      renameSync: mock(),
      mkdirSync: mock(),
    }));

    const mockStore = diContainer.get(Store);
    spyOn(mockStore, 'interpolate').mockImplementation((value) => {
      if (value === mockContent) {
        return mockInterpolatedContent;
      }

      if (value === mockSourcePath) {
        return mockAbsoluteSourcePath;
      }

      return value;
    });

    // Reset fs mocks
    (existsSync as any).mockReset();
    (writeFileSync as any).mockReset();
    (unlinkSync as any).mockReset();
    (copyFileSync as any).mockReset();
    (renameSync as any).mockReset();
    (mkdirSync as any).mockReset();

    action = diContainer.get(FileSystemAction);
  });

  afterEach(() => {
    mockFsCleaner();
    mock.restore();
  });

  describe('Operation CREATE', () => {
    test('should create a file with content', async () => {
      // Mock file does not exist
      (existsSync as any).mockReturnValue(false);

      const actionData = {
        type: 'fileSystem',
        operation: 'create',
        path: mockFilePath,
        content: mockContent,
      } as FileSystemActionCreateData;

      await action.execute(actionData);

      expect(writeFileSync).toHaveBeenCalledWith(mockAbsolutePath, mockInterpolatedContent);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('File created successfully'));
    });

    test('should throw error when file exists and overwrite option is not enabled', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileSystem',
        operation: 'create',
        path: mockFilePath,
        content: mockContent,
      } as FileSystemActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('already exists and the "overwrite" option is not enabled');
    });

    test('should create a file with content when file exists and overwrite option is enabled', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileSystem',
        operation: 'create',
        path: mockFilePath,
        content: mockContent,
        overwrite: true,
      } as FileSystemActionData;

      await action.execute(actionData);

      expect(writeFileSync).toHaveBeenCalledWith(mockAbsolutePath, mockInterpolatedContent);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('File created successfully'));
    });
  });

  describe('Operation DELETE', () => {
    test('should delete a file that exists', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileSystem',
        operation: 'delete',
        path: mockFilePath,
      } as FileSystemActionData;

      const result = await action.execute(actionData);

      expect(unlinkSync).toHaveBeenCalledWith(mockAbsolutePath);
      expect(result).toEqual({
        path: mockAbsolutePath,
        deleted: true,
      });
    });

    test('should not throw error when file does not exist', async () => {
      (existsSync as any).mockReturnValue(false);

      const actionData = {
        type: 'fileSystem',
        operation: 'delete',
        path: mockFilePath,
      } as FileSystemActionData;

      const result = await action.execute(actionData);

      expect(unlinkSync).not.toHaveBeenCalled();
      expect(result).toEqual({
        path: mockAbsolutePath,
        deleted: false,
      });
    });
  });

  describe('Operation CHECK', () => {
    test('should check if file exists', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileSystem',
        operation: 'exists',
        path: mockFilePath,
      } as FileSystemActionData;

      await action.execute(actionData);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('File "' + mockAbsolutePath + '" exists'));
    });
  });

  describe('Operation COPY', () => {
    test('should throw error when source parameter is missing', async () => {
      const actionData = {
        type: 'fileSystem',
        operation: 'copy',
        destination: mockDestinationPath,
      } as FileSystemActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('Source path is required for this action');
    });

    test('should throw error when destination parameter is missing', async () => {
      const actionData = {
        type: 'fileSystem',
        operation: 'copy',
        source: mockSourcePath,
      } as FileSystemActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('Destination path is required for this action');
    });

    test('should throw error when source does not exist', async () => {
      (existsSync as any).mockReturnValue(false);
      const actionData = {
        type: 'fileSystem',
        operation: 'copy',
        source: mockSourcePath,
        destination: mockDestinationPath,
      } as FileSystemActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow(
        `Source file "${mockAbsoluteSourcePath}" is neither in the recipe directory nor in the project directory.`,
      );
    });

    test('should throw error when destination already exist and overwrite option is not enabled', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileSystem',
        operation: 'copy',
        source: mockSourcePath,
        destination: mockDestinationPath,
      } as FileSystemActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow(
        `Destination file "${mockAbsoluteDestinationPath}" already exists and the "overwrite" option is not enabled.`,
      );
    });

    test('should copy file successfully', async () => {
      (existsSync as any).mockImplementation((path: string) => path === mockAbsoluteSourcePath);

      const actionData = {
        type: 'fileSystem',
        operation: 'copy',
        source: mockSourcePath,
        destination: mockDestinationPath,
      } as FileSystemActionData;

      await action.execute(actionData);

      expect(copyFileSync).toHaveBeenCalledWith(mockAbsoluteSourcePath, mockAbsoluteDestinationPath);
    });

    test('should copy file successfully when destination already exist and overwrite option is enabled', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileSystem',
        operation: 'copy',
        source: mockSourcePath,
        destination: mockDestinationPath,
        overwrite: true,
      } as FileSystemActionData;

      await action.execute(actionData);

      expect(copyFileSync).toHaveBeenCalledWith(mockAbsoluteSourcePath, mockAbsoluteDestinationPath);
    });
  });

  describe('Operation MOVE', () => {
    test('should throw error when source parameter is missing for move', async () => {
      const actionData = {
        type: 'fileSystem',
        operation: 'move',
        destination: mockDestinationPath,
      } as FileSystemActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('Source path is required for this action');
    });

    test('should throw error when destination parameter is missing for move', async () => {
      const actionData = {
        type: 'fileSystem',
        operation: 'move',
        source: mockSourcePath,
      } as FileSystemActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('Destination path is required for this action');
    });

    test('should move file successfully', async () => {
      (existsSync as any).mockImplementation((path: string) => path === mockAbsoluteSourcePath);

      const actionData = {
        type: 'fileSystem',
        operation: 'move',
        source: mockSourcePath,
        destination: mockDestinationPath,
      } as FileSystemActionData;

      const result = await action.execute(actionData);

      expect(renameSync).toHaveBeenCalledWith(mockAbsoluteSourcePath, mockAbsoluteDestinationPath);
      expect(result).toEqual({
        source: mockAbsoluteSourcePath,
        destination: mockAbsoluteDestinationPath,
        overwritten: false,
      });
    });

    test('should move file successfully when destination already exist and overwrite option is enabled', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileSystem',
        operation: 'move',
        source: mockSourcePath,
        destination: mockDestinationPath,
        overwrite: true,
      } as FileSystemActionData;

      const result = await action.execute(actionData);

      expect(renameSync).toHaveBeenCalledWith(mockAbsoluteSourcePath, mockAbsoluteDestinationPath);
      expect(result).toEqual({
        source: mockAbsoluteSourcePath,
        destination: mockAbsoluteDestinationPath,
        overwritten: true,
      });
    });

    test('should throw error when destination already exist and overwrite option is not enabled', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileSystem',
        operation: 'move',
        source: mockSourcePath,
        destination: mockDestinationPath,
        overwrite: false,
      } as FileSystemActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow(
        `Destination file "${mockAbsoluteDestinationPath}" already exists and the "overwrite" option is not enabled.`,
      );
    });
  });

  describe('Operation MKDIR', () => {
    test('should create a directory when it does not exist', async () => {
      // Mock directory does not exist
      (existsSync as any).mockReturnValue(false);

      const actionData = {
        type: 'fileSystem',
        operation: 'mkdir',
        path: mockFilePath,
      } as FileSystemActionData;

      await action.execute(actionData);

      expect(mkdirSync).toHaveBeenCalledWith(mockAbsolutePath);

      expect(console.log).toHaveBeenCalledWith(chalk.green('✓ ') + `Directory "${mockAbsolutePath}" created.`);
    });

    test('should not create directory when it already exists', async () => {
      // Mock directory exists
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileSystem',
        operation: 'mkdir',
        path: mockFilePath,
      } as FileSystemActionData;

      await action.execute(actionData);

      expect(mkdirSync).not.toHaveBeenCalled();

      expect(console.log).toHaveBeenCalledWith(chalk.yellow('⚠ ') + `Path "${mockAbsolutePath}" already exists.`);
    });

    test('should throw CodxError when directory creation fails', async () => {
      // Mock directory does not exist
      (existsSync as any).mockReturnValue(false);

      // Mock mkdirSync to throw an error
      const mockError = new Error('Permission denied');
      (mkdirSync as any).mockImplementation(() => {
        throw mockError;
      });

      const actionData = {
        type: 'fileSystem',
        operation: 'mkdir',
        path: mockFilePath,
      } as FileSystemActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow(`Unable to create directory "${mockAbsolutePath}"`);

      expect(console.error).toHaveBeenCalledWith(chalk.red('✗ ') + `Unable to create directory "${mockAbsolutePath}".`);
    });
  });

  test('should throw error for unrecognized operation', async () => {
    const actionData = {
      type: 'fileSystem',
      operation: 'invalid' as any,
      path: mockFilePath,
    } as FileSystemActionData;

    expect(action.execute(actionData)).rejects.toThrow(CodxError);
    expect(action.execute(actionData)).rejects.toThrow('Unrecognized file operation: invalid');
  });

  describe('checkCreateAndGetPath', () => {
    test('should throw error when source is missing', async () => {
      const actionData = {
        destination: mockDestinationPath,
      } as FileSystemActionCopyData;

      expect(() => (action as any).checkCreateAndGetPath(actionData)).toThrow(CodxError);
      expect(() => (action as any).checkCreateAndGetPath(actionData)).toThrow(
        'Source path is required for this action',
      );
    });

    test('should throw error when destination is missing', async () => {
      const actionData = {
        source: mockSourcePath,
      } as FileSystemActionCopyData;

      expect(() => (action as any).checkCreateAndGetPath(actionData)).toThrow(CodxError);
      expect(() => (action as any).checkCreateAndGetPath(actionData)).toThrow(
        'Destination path is required for this action',
      );
    });

    test('should throw error when source file does not exist', async () => {
      (existsSync as any).mockReturnValue(false);

      const actionData = {
        source: mockSourcePath,
        destination: mockDestinationPath,
      } as FileSystemActionCopyData;

      expect(() => (action as any).checkCreateAndGetPath(actionData)).toThrow(CodxError);
      expect(() => (action as any).checkCreateAndGetPath(actionData)).toThrow('Source file');
      expect(() => (action as any).checkCreateAndGetPath(actionData)).toThrow(
        `Source file "${mockAbsoluteSourcePath}" is neither in the recipe directory nor in the project directory.`,
      );
    });

    test('should throw error when destination exists and overwrite is false', async () => {
      (existsSync as any).mockImplementation(() => {
        return true; // Both source and destination exist
      });

      const actionData = {
        source: mockSourcePath,
        destination: mockDestinationPath,
        overwrite: false,
      } as FileSystemActionCopyData;

      expect(() => (action as any).checkCreateAndGetPath(actionData)).toThrow(CodxError);
      expect(() => (action as any).checkCreateAndGetPath(actionData)).toThrow(
        'already exists and the "overwrite" option is not enabled',
      );
    });

    test('should create parent directory if it does not exist', async () => {
      (existsSync as any).mockImplementation((path: string) => {
        if (path === mockAbsoluteSourcePath) return true;
        if (path === mockAbsoluteDestinationPath) return false;
        if (path === dirname(mockAbsoluteDestinationPath)) return false;

        return false;
      });

      const actionData = {
        source: mockSourcePath,
        destination: mockDestinationPath,
      } as FileSystemActionCopyData;

      (action as any).checkCreateAndGetPath(actionData);

      expect(mkdirSync).toHaveBeenCalledWith(dirname(mockAbsoluteDestinationPath), { recursive: true });
    });

    test('should return correct paths and overwrite flag', async () => {
      (existsSync as any).mockImplementation((path: string) => {
        return path === mockAbsoluteSourcePath;
      });

      const actionData = {
        source: mockSourcePath,
        destination: mockDestinationPath,
        overwrite: true,
      } as FileSystemActionCopyData;

      const result = (action as any).checkCreateAndGetPath(actionData);

      expect(result).toEqual({
        sourcePath: mockAbsoluteSourcePath,
        destinationPath: mockAbsoluteDestinationPath,
        overwrite: true,
      });
    });

    test('should use default overwrite value of false when not specified', async () => {
      (existsSync as any).mockImplementation((path: string) => {
        return path === mockAbsoluteSourcePath;
      });

      const actionData = {
        source: mockSourcePath,
        destination: mockDestinationPath,
      } as FileSystemActionMoveData;

      const result = (action as any).checkCreateAndGetPath(actionData);

      expect(result.overwrite).toBe(false);
    });

    test('should search sourcePath first in recipe directory then in projectDir', async () => {});
  });

  describe('checkSourcePath', () => {
    test('should throw error when source does not exist', async () => {
      // Mock destination exists
      (existsSync as any).mockReturnValue(false);

      expect(() => (action as any).checkSourcePath(mockAbsoluteSourcePath, false)).toThrow(CodxError);
      expect(() => (action as any).checkSourcePath(mockAbsoluteSourcePath, false)).toThrow(
        `Source file "${mockAbsoluteSourcePath}" does not exist.`,
      );
    });

    test('should not throw error when source exists', async () => {
      // Mock destination does not exist
      (existsSync as any).mockReturnValue(true);

      expect(() => (action as any).checkSourcePath(mockAbsoluteSourcePath, false)).not.toThrow();
    });
  });

  describe('checkDestPath', () => {
    test('should throw error when destination exists and overwrite is false', async () => {
      // Mock destination exists
      (existsSync as any).mockReturnValue(true);

      expect(() => (action as any).checkDestPath(mockAbsoluteDestinationPath, false)).toThrow(CodxError);
      expect(() => (action as any).checkDestPath(mockAbsoluteDestinationPath, false)).toThrow(
        'already exists and the "overwrite" option is not enabled',
      );
    });

    test('should not throw error when destination exists and overwrite is true', async () => {
      // Mock destination exists
      (existsSync as any).mockReturnValue(true);

      expect(() => (action as any).checkDestPath(mockAbsoluteDestinationPath, true)).not.toThrow();
    });

    test('should not throw error when destination does not exist', async () => {
      // Mock destination does not exist
      (existsSync as any).mockReturnValue(false);

      expect(() => (action as any).checkDestPath(mockAbsoluteDestinationPath, false)).not.toThrow();
    });
  });
});
