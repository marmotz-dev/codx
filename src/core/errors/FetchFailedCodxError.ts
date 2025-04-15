/**
 * Error thrown when fetching a URL fails
 */
import { CodxError } from '@/core/CodxError';

export class FetchFailedCodxError extends CodxError {
  constructor(url: string, status: number, statusText: string) {
    super(`Failed to fetch ${url}: ${status} ${statusText}`);
    this.name = 'FetchFailedCodxError';
  }
}
