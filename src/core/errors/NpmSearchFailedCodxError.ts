/**
 * Error thrown when searching for npm packages fails
 */
import { CodxError } from '@/core/CodxError';

export class NpmSearchFailedCodxError extends CodxError {
  constructor(status: number, statusText: string) {
    super(`Failed to search npm packages: ${status} ${statusText}`);
    this.name = 'NpmSearchFailedCodxError';
  }
}
