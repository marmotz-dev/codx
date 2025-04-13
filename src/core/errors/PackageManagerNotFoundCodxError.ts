/**
 * Error thrown when a package manager is not found
 */
import { CodxError } from '@/core/CodxError';

export class PackageManagerNotFoundCodxError extends CodxError {
  constructor() {
    super('Package manager not found.');
    this.name = 'PackageManagerNotFoundCodxError';
  }
}
