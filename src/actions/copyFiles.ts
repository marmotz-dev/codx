import { LoggerService } from '@/services/logger';
import { Action, ActionContext } from '@/types/action.type';
import { CopyFilesArgs } from '@/types/actions/copyFiles.type';
import { copyFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';

export const copyFiles: Action<CopyFilesArgs> = async ({
  args: files,
  projectDirectory,
  recipeDirectory,
}: ActionContext<CopyFilesArgs>): Promise<void> => {
  const logger = LoggerService.getInstance();

  if (!files || files.length === 0) {
    throw new Error('At least one file or directory must be specified for the "copyFiles" action');
  }

  for (const { from, to } of files) {
    try {
      const sourcePath = resolve(recipeDirectory, from);
      const targetPath = resolve(projectDirectory, to);

      // Crée le répertoire cible s'il n'existe pas
      await mkdir(dirname(targetPath), { recursive: true });

      // Copie le fichier
      await copyFile(sourcePath, targetPath);

      logger.success(`Copied ${sourcePath} to ${targetPath}`);
    } catch (error) {
      logger.error(`Failed to copy ${from} to ${to}`);
      throw error;
    }
  }
};
