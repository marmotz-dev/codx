/**
 * Error thrown when an HTTP request fails
 */
import { CodxError } from '@/core/CodxError';

export class HttpErrorCodxError extends CodxError {
  constructor(status: number, statusText: string) {
    super(`HTTP Error: ${status} ${statusText}`);
    this.name = 'HttpErrorCodxError';
  }
}
