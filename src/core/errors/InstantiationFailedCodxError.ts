/**
 * Error thrown when instantiation of a class fails
 */
import { CodxError } from '@/core/CodxError';

export class InstantiationFailedCodxError extends CodxError {
  constructor(className: string, error?: unknown) {
    super(`Unable to instanciate ${className}`, error);
    this.name = 'InstantiationFailedCodxError';
  }
}
