import { Action } from '@/actions/action.type';
import { FsMkdirArgs } from '@/actions/fs/fs.type';
import { loggerService } from '@/services/logger';
import { mkdir } from 'fs/promises';
import { resolve } from 'path';

export const fsMkdirAction: Action<FsMkdirArgs> = async ({ args: directories, projectDirectory }) => {
  directories = Array.isArray(directories) ? directories : [directories];

  const logger = loggerService;

  if (!directories || directories.length === 0) {
    throw new Error('At least one directory must be specified for the "mkdir" action');
  }

  for (const directory of directories) {
    try {
      const targetPath = resolve(projectDirectory, directory);

      await mkdir(targetPath, { recursive: true });

      logger.success(`${targetPath} has been created`);
    } catch (error) {
      logger.error(`Failed to create "${directory}" directory`);
      throw error;
    }
  }
};
