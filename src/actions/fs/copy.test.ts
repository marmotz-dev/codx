import { fsCopyAction } from '@/actions/fs/copy';
import { argsToContext, createActionContext } from '@/test-helpers/actionContext';
import { MockCleaner, mockModule } from '@/test-helpers/mockModule';
import { afterEach, beforeEach, describe, expect, it, jest, spyOn } from 'bun:test';
import { copyFile, lstat, mkdir } from 'fs/promises';
import { readdir } from 'node:fs/promises';
import { resolve } from 'path';

describe('copy action', () => {
  const mockRecipeDir = '/path/to/recipe';
  const mockProjectDir = '/path/to/project';
  let cleanFsMock: MockCleaner;

  beforeEach(async () => {
    // Mock process.cwd()
    spyOn(process, 'cwd').mockReturnValue(mockProjectDir);

    // Mock fs functions
    cleanFsMock = await mockModule('fs/promises', () => ({
      lstat: jest.fn().mockResolvedValue({ isDirectory: () => false, isFile: () => true }),
      mkdir: jest.fn().mockResolvedValue(undefined),
      copyFile: jest.fn().mockResolvedValue(undefined),
      readdir: jest.fn(),
    }));
  });

  afterEach(() => {
    cleanFsMock();
  });

  describe('Copy files', () => {
    it('should copy files from recipe directory to project directory', async () => {
      const files = [
        { from: 'prettierignore', to: '.prettierignore' },
        {
          from: 'config/test.json',
          to: 'test.json',
        },
      ];

      await fsCopyAction(
        createActionContext({
          args: files,
          projectDirectory: mockProjectDir,
          recipeDirectory: mockRecipeDir,
        }),
      );

      // Verify that the files were copied to the correct locations
      expect(copyFile).toHaveBeenCalledTimes(2);
      expect(copyFile).toHaveBeenCalledWith(
        resolve(mockRecipeDir, 'prettierignore'),
        resolve(mockProjectDir, '.prettierignore'),
      );
      expect(copyFile).toHaveBeenCalledWith(
        resolve(mockRecipeDir, 'config/test.json'),
        resolve(mockProjectDir, 'test.json'),
      );
    });

    it('should create target directories if they do not exist', async () => {
      const files = [{ from: 'test.json', to: 'config/deep/test.json' }];

      await fsCopyAction(createActionContext({ args: files, projectDirectory: mockProjectDir }));

      expect(mkdir).toHaveBeenCalledWith(resolve(mockProjectDir, 'config/deep'), { recursive: true });
    });

    it('should throw error if file copy fails', async () => {
      (copyFile as jest.Mock).mockRejectedValue(new Error('Copy failed'));

      const files = [{ from: 'test.json', to: 'test.json' }];

      expect(fsCopyAction(argsToContext(files))).rejects.toThrow();
    });
  });

  describe('Copy directories', () => {
    it('should copy entire directory structure recursively', async () => {
      // Mock directory structure with nested files and subdirectories
      (lstat as jest.Mock)
        .mockResolvedValueOnce({ isDirectory: () => true, isFile: () => false })
        .mockResolvedValueOnce({ isDirectory: () => false, isFile: () => true })
        .mockResolvedValueOnce({ isDirectory: () => false, isFile: () => true });

      (readdir as jest.Mock).mockResolvedValue([
        {
          name: 'file1.txt',
          isDirectory: () => false,
          isFile: () => true,
        },
        {
          name: 'file2.txt',
          isDirectory: () => false,
          isFile: () => true,
        },
      ]);
      (mkdir as jest.Mock).mockResolvedValue(undefined);
      (copyFile as jest.Mock).mockResolvedValue(undefined);

      const files = [
        {
          from: 'src',
          to: 'dest/project-src',
        },
      ];

      await fsCopyAction(
        createActionContext({
          args: files,
          projectDirectory: mockProjectDir,
          recipeDirectory: mockRecipeDir,
        }),
      );

      // Verify directory and file copies
      expect(mkdir).toHaveBeenCalledWith(resolve(mockProjectDir, 'dest/project-src'), { recursive: true });
      expect(copyFile).toHaveBeenCalledTimes(2);
    });

    it('should handle deeply nested directory structure', async () => {
      (lstat as jest.Mock)
        .mockResolvedValueOnce({ isDirectory: () => true, isFile: () => false })
        .mockResolvedValueOnce({ isDirectory: () => true, isFile: () => false })
        .mockResolvedValueOnce({ isDirectory: () => false, isFile: () => true });
      (readdir as jest.Mock)
        .mockResolvedValueOnce([
          {
            name: 'subdir',
            isDirectory: () => true,
            isFile: () => false,
          },
          {
            name: 'file.txt',
            isDirectory: () => false,
            isFile: () => true,
          },
        ])
        .mockResolvedValueOnce([
          {
            name: 'deepfile.txt',
            isDirectory: () => false,
            isFile: () => true,
          },
        ]);
      (mkdir as jest.Mock).mockResolvedValue(undefined);
      (copyFile as jest.Mock).mockResolvedValue(undefined);

      const files = [
        {
          from: 'complex-project',
          to: 'dest/complex-project',
        },
      ];

      await fsCopyAction(
        createActionContext({
          args: files,
          projectDirectory: mockProjectDir,
          recipeDirectory: mockRecipeDir,
        }),
      );

      // Verify complex directory structure copy
      expect(mkdir).toHaveBeenCalledWith(resolve(mockProjectDir, 'dest/complex-project/subdir'), { recursive: true });
      expect(copyFile).toHaveBeenCalledTimes(2);
    });

    it('should handle mixed file and directory copy', async () => {
      (lstat as jest.Mock)
        .mockResolvedValueOnce({ isDirectory: () => true, isFile: () => false })
        .mockResolvedValueOnce({ isDirectory: () => false, isFile: () => true })
        .mockResolvedValueOnce({ isDirectory: () => true, isFile: () => false });
      (readdir as jest.Mock)
        .mockResolvedValueOnce([
          {
            name: 'config',
            isDirectory: () => true,
            isFile: () => false,
          },
          {
            name: 'README.md',
            isDirectory: () => false,
            isFile: () => true,
          },
        ])
        .mockResolvedValueOnce([
          {
            name: 'settings.json',
            isDirectory: () => false,
            isFile: () => true,
          },
        ]);
      (mkdir as jest.Mock).mockResolvedValue(undefined);
      (copyFile as jest.Mock).mockResolvedValue(undefined);

      const files = [
        {
          from: 'project',
          to: 'dest/project',
        },
      ];

      await fsCopyAction(
        createActionContext({
          args: files,
          projectDirectory: mockProjectDir,
          recipeDirectory: mockRecipeDir,
        }),
      );

      // Verify mixed copy behavior
      expect(mkdir).toHaveBeenCalledWith(resolve(mockProjectDir, 'dest/project/config'), { recursive: true });
      expect(copyFile).toHaveBeenCalledTimes(2);
    });
  });

  describe('Common', () => {
    it('should throw error when no file/directory was specified', async () => {
      const result = fsCopyAction(argsToContext([]));
      expect(result).rejects.toThrow('At least one file or directory must be specified for the "copy" action');
    });
  });
});
