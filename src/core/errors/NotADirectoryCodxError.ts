/**
 * Error thrown when a path is not a directory
 */
import { CodxError } from '@/core/CodxError';

export class NotADirectoryCodxError extends CodxError {
  constructor(directoryPath: string) {
    super(`"${directoryPath}" is not a directory`);
    this.name = 'NotADirectoryCodxError';
  }
}
