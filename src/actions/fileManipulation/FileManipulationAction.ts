import { BaseAction } from '@/actions/BaseAction';
import {
  FileManipulationActionAppendData,
  FileManipulationActionCreateData,
  FileManipulationActionData,
  FileManipulationActionPrependData,
  FileManipulationActionUpdateData,
} from '@/actions/fileManipulation/FileManipulationAction.schema';
import { FileAlreadyExistsCodxError } from '@/core/errors/FileAlreadyExistsCodxError';
import { FileNotFoundCodxError } from '@/core/errors/FileNotFoundCodxError';
import { InvalidRegexPatternCodxError } from '@/core/errors/InvalidRegexPatternCodxError';
import { UnknownOperationCodxError } from '@/core/errors/UnknownOperationCodxError';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

/**
 * Action to manipulate file content
 */
export class FileManipulationAction extends BaseAction {
  /**
   * Executes the action on a file
   * @param {FileManipulationActionData} actionData Action data
   */
  public async execute(actionData: FileManipulationActionData) {
    const { operation } = actionData;

    switch (operation) {
      case 'append':
        return this.executeAppend(actionData);

      case 'create':
        return this.executeCreate(actionData);

      case 'prepend':
        return this.executePrepend(actionData);

      case 'update':
        return this.executeUpdate(actionData);

      default:
        throw new UnknownOperationCodxError(operation);
    }
  }

  /**
   * Appends content to the end of a file
   * @param {FileManipulationActionAppendData} actionData Action data
   */
  private executeAppend(actionData: FileManipulationActionAppendData) {
    const { path, content } = actionData;

    const interpolatedPath = this.interpolate(path);
    const absolutePath = this.context.projectDirectory.resolve(interpolatedPath);

    if (!existsSync(absolutePath)) {
      throw new FileNotFoundCodxError(absolutePath);
    }

    const interpolatedContent = this.interpolate(content);
    const existingContent = readFileSync(absolutePath, 'utf8');
    const newContent = existingContent + interpolatedContent;

    writeFileSync(absolutePath, newContent);
    this.logger.success(`Content appended successfully to: ${absolutePath}`);

    return {
      path: absolutePath,
      appended: true,
    };
  }

  /**
   * Creates a file with the specified content
   * @param {FileManipulationActionCreateData} actionData Action data
   */
  private executeCreate(actionData: FileManipulationActionCreateData) {
    const { path, content, overwrite = false } = actionData;

    const interpolatedPath = this.interpolate(path);
    const absolutePath = this.context.projectDirectory.resolve(interpolatedPath);
    let overwritten = false;

    if (existsSync(absolutePath)) {
      if (overwrite) {
        overwritten = true;
      } else {
        throw new FileAlreadyExistsCodxError(absolutePath);
      }
    }

    const parentPath = dirname(absolutePath);
    if (!existsSync(parentPath)) {
      mkdirSync(parentPath, { recursive: true });
    }

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
   * Prepends content to the beginning of a file
   * @param {FileManipulationActionPrependData} actionData Action data
   */
  private executePrepend(actionData: FileManipulationActionPrependData) {
    const { path, content } = actionData;

    const interpolatedPath = this.interpolate(path);
    const absolutePath = this.context.projectDirectory.resolve(interpolatedPath);

    if (!existsSync(absolutePath)) {
      throw new FileNotFoundCodxError(absolutePath);
    }

    const interpolatedContent = this.interpolate(content);
    const existingContent = readFileSync(absolutePath, 'utf8');
    const newContent = interpolatedContent + existingContent;

    writeFileSync(absolutePath, newContent);
    this.logger.success(`Content prepended successfully to: ${absolutePath}`);

    return {
      path: absolutePath,
      prepended: true,
    };
  }

  /**
   * Updates content in a file using a regex pattern
   * @param {FileManipulationActionUpdateData} actionData Action data
   */
  private executeUpdate(actionData: FileManipulationActionUpdateData) {
    const { path, pattern, content } = actionData;

    const interpolatedPath = this.interpolate(path);
    const absolutePath = this.context.projectDirectory.resolve(interpolatedPath);

    if (!existsSync(absolutePath)) {
      throw new FileNotFoundCodxError(absolutePath);
    }

    const interpolatedPattern = this.interpolate(pattern);
    const interpolatedContent = this.interpolate(content);
    const existingContent = readFileSync(absolutePath, 'utf8');

    try {
      const regex = new RegExp(interpolatedPattern, 'g');
      const newContent = existingContent.replace(regex, interpolatedContent);

      if (newContent === existingContent) {
        this.logger.warning(`Pattern "${interpolatedPattern}" not found in file: ${absolutePath}`);

        return {
          path: absolutePath,
          updated: false,
        };
      }

      writeFileSync(absolutePath, newContent);
      this.logger.success(`Content updated successfully in: ${absolutePath}`);

      return {
        path: absolutePath,
        updated: true,
      };
    } catch (error) {
      throw new InvalidRegexPatternCodxError(interpolatedPattern, error as Error);
    }
  }
}
