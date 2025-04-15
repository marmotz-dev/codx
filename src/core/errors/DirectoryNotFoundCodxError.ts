/**
 * Error thrown when a directory is not found
 */
import { CodxError } from '@/core/CodxError';

export class DirectoryNotFoundCodxError extends CodxError {
  constructor(directoryPath: string) {
    super(`Directory "${directoryPath}" does not exist`);
    this.name = 'DirectoryNotFoundCodxError';
  }
}
