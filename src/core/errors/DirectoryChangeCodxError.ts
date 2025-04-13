/**
 * Error thrown when directory change fail
 */
import { CodxError } from '@/core/CodxError';

export class DirectoryChangeCodxError extends CodxError {
  constructor(error: Error) {
    super('Error changing directory', error);
    this.name = 'DirectoryChangeCodxError';
  }
}
