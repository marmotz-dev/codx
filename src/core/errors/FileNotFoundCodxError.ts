/**
 * Error thrown when a file is not found
 */
import { CodxError } from '@/core/CodxError';

export class FileNotFoundCodxError extends CodxError {
  constructor(path: string) {
    super(`File "${path}" does not exist.`);
    this.name = 'FileNotFoundCodxError';
  }
}
