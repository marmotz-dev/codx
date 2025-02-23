import { Action } from '@/actions/action.type';
import { FsDeleteArgs } from '@/actions/fs/fs.type';
import { loggerService } from '@/services/logger';
import { rm } from 'node:fs/promises';
import { resolve } from 'path';

export const fsDeleteAction: Action<FsDeleteArgs> = async ({ args: filesOrDirectories, projectDirectory }) => {
  filesOrDirectories = Array.isArray(filesOrDirectories) ? filesOrDirectories : [filesOrDirectories];

  const logger = loggerService;

  if (!filesOrDirectories || filesOrDirectories.length === 0) {
    throw new Error('At least one file or directory must be specified for the "delete" action');
  }

  for (const fileOrDirectory of filesOrDirectories) {
    try {
      const targetPath = resolve(projectDirectory, fileOrDirectory);

      await rm(targetPath);

      logger.success(`${targetPath} has been deleted`);
    } catch (error) {
      logger.error(`Failed to delete "${fileOrDirectory}"`);
      throw error;
    }
  }
};
