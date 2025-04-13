/**
 * Error thrown when a package is empty
 */
import { CodxError } from '@/core/CodxError';

export class EmptyPackageCodxError extends CodxError {
  constructor() {
    super('Package is empty.');
    this.name = 'EmptyPackageCodxError';
  }
}
