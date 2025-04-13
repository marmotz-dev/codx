/**
 * Error thrown when a file already exists and overwrite is not enabled
 */
import { CodxError } from '@/core/CodxError';

export class FileAlreadyExistsCodxError extends CodxError {
  constructor(path: string) {
    super(`File "${path}" already exists and the "overwrite" option is not enabled.`);
    this.name = 'FileAlreadyExistsCodxError';
  }
}
