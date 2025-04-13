/**
 * Error thrown when a source file is not found
 */
import { CodxError } from '@/core/CodxError';

export class SourceFileNotFoundCodxError extends CodxError {
  constructor(path: string) {
    super(`Source file "${path}" does not exist.`);
    this.name = 'SourceFileNotFoundCodxError';
  }
}
