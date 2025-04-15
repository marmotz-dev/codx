/**
 * Error thrown when no packages are found matching a search term
 */
import { CodxError } from '@/core/CodxError';

export class NoPackagesFoundCodxError extends CodxError {
  constructor(searchTerm: string) {
    super(`No packages found matching "${searchTerm}"`);
    this.name = 'NoPackagesFoundCodxError';
  }
}
