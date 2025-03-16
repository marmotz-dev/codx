import { BaseAction } from '@/actions/BaseAction';
import {
  FileSystemActionCopyData,
  FileSystemActionCreateData,
  FileSystemActionData,
  FileSystemActionDeleteData,
  FileSystemActionExistsData,
  FileSystemActionMkdirData,
  FileSystemActionMoveData,
} from '@/actions/fileSystem/FileSystemAction.schema';
import { CodxError } from '@/core/CodxError';
import { copyFileSync, existsSync, mkdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
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

      case 'create':
        return this.executeCreate(actionData);

      case 'delete':
        return this.executeDelete(actionData);

      case 'exists':
        return this.executeExists(actionData);

      case 'mkdir':
        return this.executeMkdir(actionData);

      case 'move':
        return this.executeMove(actionData);

      default:
        throw new CodxError(`Unrecognized file operation: ${operation}`);
    }
  }

  private checkCreateAndGetPath(actionData: FileSystemActionCopyData | FileSystemActionMoveData) {
    const { source, destination, overwrite = false } = actionData;

    if (!source) {
      throw new CodxError('Source path is required for this action');
    }

    if (!destination) {
      throw new CodxError('Destination path is required for this action');
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
      throw new CodxError(
        `Source file "${interpolatedSourcePath}" is neither in the recipe directory nor in the project directory.`,
      );
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
      throw new CodxError(`Destination file "${dest}" already exists and the "overwrite" option is not enabled.`);
    }
  }

  private checkSourcePath(source: string) {
    if (!existsSync(source)) {
      throw new CodxError(`Source file "${source}" does not exist.`);
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
        throw new CodxError(
          `Destination "${destinationPath}" already exists and the "overwrite" option is not enabled.`,
        );
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
   * Creates a file with the specified content
   * @param {FileSystemActionCreateData} actionData Action data
   */
  private executeCreate(actionData: FileSystemActionCreateData) {
    const { path, content, overwrite = false } = actionData;

    const interpolatedPath = this.interpolate(path);
    const absolutePath = this.context.projectDirectory.resolve(interpolatedPath);
    let overwritten = false;

    if (existsSync(absolutePath)) {
      if (overwrite) {
        overwritten = true;
      } else {
        throw new CodxError(`File "${absolutePath}" already exists and the "overwrite" option is not enabled.`);
      }
    }

    this.createParentDirIfNeeded(absolutePath);

    const interpolatedContent = this.interpolate(content ?? '');

    // Write the content to the file
    writeFileSync(absolutePath, interpolatedContent);
    this.logger.success(`File created successfully: ${absolutePath}`);

    return {
      path: absolutePath,
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
      } catch (e) {
        const message = `Unable to create directory "${absolutePath}".`;
        this.logger.error(message);

        throw new CodxError(message, e);
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
        throw new CodxError(
          `Destination "${destinationPath}" already exists and the "overwrite" option is not enabled.`,
        );
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
