/**
 * Error thrown when downloading a file fails
 */
import { CodxError } from '@/core/CodxError';

export class DownloadFailedCodxError extends CodxError {
  constructor(url: string, error?: unknown) {
    super(`Failed to download ${url}`, error);
    this.name = 'DownloadFailedCodxError';
  }
}
