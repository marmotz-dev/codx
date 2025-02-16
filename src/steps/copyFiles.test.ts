import { copyFiles } from '@/steps/copyFiles';
import { argsToContext, createStepContext } from '@/tests/stepContext';
import { beforeEach, describe, expect, it, jest, mock, spyOn } from 'bun:test';
import { copyFile, mkdir } from 'fs/promises';
import { resolve } from 'path';

describe('copyFiles', () => {
  const mockRecipeDir = '/path/to/recipe';
  const mockProjectDir = '/path/to/project';

  beforeEach(() => {
    // Mock process.cwd()
    spyOn(process, 'cwd').mockReturnValue(mockProjectDir);

    // Mock fs functions
    mock.module('fs/promises', () => ({
      mkdir: jest.fn().mockResolvedValue(undefined),
      copyFile: jest.fn().mockResolvedValue(undefined),
    }));
  });

  it('should copy files from recipe directory to project directory', async () => {
    const files = [
      { from: 'prettierignore', to: '.prettierignore' },
      {
        from: 'config/test.json',
        to: 'config/test.json',
      },
    ];

    await copyFiles(
      createStepContext({
        args: files,
        projectDirectory: mockProjectDir,
        recipeDirectory: mockRecipeDir,
      }),
    );

    // Vérifie que les fichiers ont été copiés aux bons endroits
    expect(copyFile).toHaveBeenCalledTimes(2);
    expect(copyFile).toHaveBeenCalledWith(
      resolve(mockRecipeDir, 'prettierignore'),
      resolve(mockProjectDir, '.prettierignore'),
    );
    expect(copyFile).toHaveBeenCalledWith(
      resolve(mockRecipeDir, 'config/test.json'),
      resolve(mockProjectDir, 'config/test.json'),
    );
  });

  it('should create target directories if they do not exist', async () => {
    const files = [{ from: 'config/deep/test.json', to: 'config/deep/test.json' }];

    await copyFiles(createStepContext({ args: files, projectDirectory: mockProjectDir }));

    expect(mkdir).toHaveBeenCalledWith(resolve(mockProjectDir, 'config/deep'), { recursive: true });
  });

  it('should throw error if copy fails', async () => {
    mock.module('fs/promises', () => ({
      copyFile: jest.fn().mockRejectedValue(new Error('Copy failed')),
    }));

    const files = [{ from: 'test.json', to: 'test.json' }];

    expect(copyFiles(argsToContext(files))).rejects.toThrow();
  });

  it('should throw error when no file/directory was specified', async () => {
    const result = copyFiles(argsToContext([]));
    expect(result).rejects.toThrow('At least one file or directory must be specified for the "copyFiles" step');
  });
});
