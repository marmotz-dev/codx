/**
 * Error thrown when a path is outside the current working directory
 */
import { CodxError } from '@/core/CodxError';

export class PathOutsideWorkingDirectoryCodxError extends CodxError {
  constructor(path: string) {
    super(`Path "${path}" is outside of the current working directory.`);
    this.name = 'PathOutsideWorkingDirectoryCodxError';
  }
}
