/**
 * Error thrown when file is unreadable
 */
import { CodxError } from '@/core/CodxError';

export class FileUnreadableCodxError extends CodxError {
  constructor(path: string, error: Error) {
    super(`Error reading ${path}`, error);
    this.name = 'FileUnreadableCodxError';
  }
}
