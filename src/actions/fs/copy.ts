import { Action } from '@/actions/action.type';
import { FsCopyArgs } from '@/actions/fs/fs.type';
import { loggerService } from '@/services/logger';
import { copyFile, lstat, mkdir } from 'fs/promises';
import { readdir } from 'node:fs/promises';
import { dirname, resolve } from 'path';

export const fsCopyAction: Action<FsCopyArgs> = async ({ args: files, projectDirectory, recipeDirectory }) => {
  const logger = loggerService;

  if (!files || files.length === 0) {
    throw new Error('At least one file or directory must be specified for the "copy" action');
  }

  for (const { from, to } of files) {
    try {
      const sourcePath = resolve(recipeDirectory, from);
      const targetPath = resolve(projectDirectory, to);

      await copy(sourcePath, targetPath);

      logger.success(`Copied ${sourcePath} to ${targetPath}`);
    } catch (error) {
      logger.error(`Failed to copy ${from} to ${to}`);
      throw error;
    }
  }
};

async function copy(sourcePath: string, targetPath: string) {
  // Create the target directory if it does not exist
  await mkdir(dirname(targetPath), { recursive: true });

  const sourceStats = await lstat(sourcePath);
  if (sourceStats.isDirectory()) {
    await copyDirectory(sourcePath, targetPath);
  } else if (sourceStats.isFile()) {
    await copyFile(sourcePath, targetPath);
  }
}

async function copyDirectory(sourceDir: string, targetDir: string) {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  await mkdir(targetDir, { recursive: true });

  for (const entry of entries) {
    const sourceEntryPath = resolve(sourceDir, entry.name);
    const targetEntryPath = resolve(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourceEntryPath, targetEntryPath);
    } else if (entry.isFile()) {
      await copyFile(sourceEntryPath, targetEntryPath);
    }
  }
}
