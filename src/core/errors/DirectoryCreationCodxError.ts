/**
 * Error thrown when we can't create a directory
 */
import { CodxError } from '@/core/CodxError';

export class DirectoryCreationCodxError extends CodxError {
  constructor(path: string, error: Error) {
    super(`Unable to create directory "${path}"`, error);
    this.name = 'DirectoryCreationCodxError';
  }
}
