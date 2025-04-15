/**
 * Error thrown when fetching a tarball URL fails
 */
import { CodxError } from '@/core/CodxError';

export class TarballUrlFetchFailedCodxError extends CodxError {
  constructor(packageName: string, version: string) {
    super(`Failed to get tarball URL for ${packageName}@${version}`);
    this.name = 'TarballUrlFetchFailedCodxError';
  }
}
