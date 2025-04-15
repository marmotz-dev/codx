/**
 * Error thrown when extracting a tarball fails
 */
import { CodxError } from '@/core/CodxError';

export class TarballExtractionFailedCodxError extends CodxError {
  constructor(error?: unknown) {
    super('Failed to extract tarball', error);
    this.name = 'TarballExtractionFailedCodxError';
  }
}
