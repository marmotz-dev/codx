/**
 * Error thrown when a package list is empty or invalid
 */
import { CodxError } from '@/core/CodxError';

export class EmptyPackageListCodxError extends CodxError {
  constructor() {
    super('Package list is empty or invalid.');
    this.name = 'EmptyPackageListCodxError';
  }
}
