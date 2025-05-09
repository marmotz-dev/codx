import { BaseAction } from '@/actions/BaseAction';
import {
  FileSystemActionCopyData,
  FileSystemActionData,
  FileSystemActionDeleteData,
  FileSystemActionExistsData,
  FileSystemActionMkdirData,
  FileSystemActionMoveData,
} from '@/actions/fileSystem/FileSystemAction.schema';
import { DestinationFileAlreadyExistsCodxError } from '@/core/errors/DestinationFileAlreadyExistsCodxError';
import { DirectoryCreationCodxError } from '@/core/errors/DirectoryCreationCodxError';
import { MissingDestinationPathCodxError } from '@/core/errors/MissingDestinationPathCodxError';
import { MissingSourcePathCodxError } from '@/core/errors/MissingSourcePathCodxError';
import { PathOutsideWorkingDirectoryCodxError } from '@/core/errors/PathOutsideWorkingDirectoryCodxError';
import { SourceFileNotFoundCodxError } from '@/core/errors/SourceFileNotFoundCodxError';
import { UnknownOperationCodxError } from '@/core/errors/UnknownOperationCodxError';
import { copyFileSync, existsSync, mkdirSync, renameSync, unlinkSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * Action to manipulate files
 */
export class FileSystemAction extends BaseAction {
  /**
   * Executes the action on a file
   * @param {FileSystemActionData} actionData Action data
   */
  public async execute(actionData: FileSystemActionData) {
    const { operation } = actionData;

    switch (operation) {
      case 'copy':
        return this.executeCopy(actionData);

      case 'delete':
        return this.executeDelete(actionData);

      case 'exists':
        return this.executeExists(actionData);

      case 'mkdir':
        return this.executeMkdir(actionData);

      case 'move':
        return this.executeMove(actionData);

      default:
        throw new UnknownOperationCodxError(operation);
    }
  }

  private checkCreateAndGetPath(actionData: FileSystemActionCopyData | FileSystemActionMoveData) {
    const { source, destination, overwrite = false } = actionData;

    if (!source) {
      throw new MissingSourcePathCodxError();
    }

    if (!destination) {
      throw new MissingDestinationPathCodxError();
    }

    const interpolatedSourcePath = this.interpolate(source);
    let sourcePath: string | undefined = undefined;

    try {
      sourcePath = this.context.recipeDirectory.resolve(interpolatedSourcePath);
    } catch {
      this.logger.warning(`Source file "${interpolatedSourcePath}" is not in the recipe directory.`);
    }

    if (!sourcePath || !existsSync(sourcePath)) {
      try {
        sourcePath = this.context.projectDirectory.resolve(interpolatedSourcePath);
      } catch {
        this.logger.warning(`Source file "${interpolatedSourcePath}" is not in the project directory.`);
      }
    }

    if (!sourcePath || !existsSync(sourcePath)) {
      throw new PathOutsideWorkingDirectoryCodxError(interpolatedSourcePath);
    }

    const interpolatedDestinationPath = this.interpolate(destination);
    const destinationPath = this.context.projectDirectory.resolve(interpolatedDestinationPath);

    this.checkSourcePath(sourcePath);
    this.checkDestPath(destinationPath, overwrite);
    this.createParentDirIfNeeded(destinationPath);

    return { sourcePath, destinationPath, overwrite };
  }

  private checkDestPath(dest: string, overwrite: boolean) {
    if (existsSync(dest) && !overwrite) {
      throw new DestinationFileAlreadyExistsCodxError(dest);
    }
  }

  private checkSourcePath(source: string) {
    if (!existsSync(source)) {
      throw new SourceFileNotFoundCodxError(source);
    }
  }

  private createParentDirIfNeeded(path: string) {
    const parentPath = dirname(path);
    if (!existsSync(parentPath)) {
      mkdirSync(parentPath, { recursive: true });
    }
  }

  /**
   * Copies a file
   * @param {FileSystemActionCopyData} actionData Action data
   */
  private executeCopy(actionData: FileSystemActionCopyData) {
    const { sourcePath, destinationPath, overwrite = false } = this.checkCreateAndGetPath(actionData);

    let overwritten = false;

    if (existsSync(destinationPath)) {
      if (overwrite) {
        overwritten = true;
      } else {
        throw new DestinationFileAlreadyExistsCodxError(destinationPath);
      }
    }

    copyFileSync(sourcePath, destinationPath);
    this.logger.success(`"${sourcePath}" copied successfully to "${destinationPath}".`);

    return {
      source: sourcePath,
      destination: destinationPath,
      overwritten,
    };
  }

  /**
   * Deletes a file
   * @param {FileSystemActionDeleteData} actionData Action data
   */
  private executeDelete(actionData: FileSystemActionDeleteData) {
    const { path } = actionData;

    const interpolatedPath = this.interpolate(path);
    const absolutePath = this.context.projectDirectory.resolve(interpolatedPath);

    let deleted = false;

    if (!existsSync(absolutePath)) {
      this.logger.info(`File "${absolutePath}" does not exist, nothing to delete.`);
    } else {
      unlinkSync(absolutePath);
      this.logger.success(`File deleted successfully: ${absolutePath}`);
      deleted = true;
    }

    return {
      path: absolutePath,
      deleted,
    };
  }

  /**
   * Checks if a file exists
   * @param {FileSystemActionExistsData} actionData Action data
   */
  private executeExists(actionData: FileSystemActionExistsData) {
    const { path } = actionData;

    const interpolatedPath = this.interpolate(path);
    const absolutePath = this.context.projectDirectory.resolve(interpolatedPath);

    const exists = existsSync(absolutePath);
    if (exists) {
      this.logger.info(`File "${absolutePath}" exists.`);
    } else {
      this.logger.info(`File "${absolutePath}" does not exist.`);
    }

    return {
      path: absolutePath,
      exists,
    };
  }

  /**
   * Checks if a file exists
   * @param {FileSystemActionMkdirData} actionData Action data
   */
  private executeMkdir(actionData: FileSystemActionMkdirData) {
    const { path } = actionData;

    const interpolatedPath = this.interpolate(path);
    const absolutePath = this.context.projectDirectory.resolve(interpolatedPath);

    const exists = existsSync(absolutePath);
    if (exists) {
      this.logger.warning(`Path "${absolutePath}" already exists.`);
    } else {
      try {
        mkdirSync(absolutePath);
        this.logger.success(`Directory "${absolutePath}" created.`);
      } catch (error) {
        this.logger.error(`Unable to create directory "${absolutePath}".`);

        throw new DirectoryCreationCodxError(absolutePath, error as Error);
      }
    }

    return {
      path: absolutePath,
      created: !exists,
    };
  }

  /**
   * Moves a file
   * @param {FileSystemActionMoveData} actionData Action data
   */
  private executeMove(actionData: FileSystemActionMoveData) {
    const { sourcePath, destinationPath, overwrite = false } = this.checkCreateAndGetPath(actionData);

    let overwritten = false;

    if (existsSync(destinationPath)) {
      if (overwrite) {
        overwritten = true;
      } else {
        throw new DestinationFileAlreadyExistsCodxError(destinationPath);
      }
    }

    renameSync(sourcePath, destinationPath);
    this.logger.success(`"${sourcePath}" moved successfully to "${destinationPath}".`);

    return {
      source: sourcePath,
      destination: destinationPath,
      overwritten,
    };
  }
}
