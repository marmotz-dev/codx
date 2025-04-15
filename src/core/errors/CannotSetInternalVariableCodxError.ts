/**
 * Error thrown when attempting to set an internal variable
 */
import { CodxError } from '@/core/CodxError';

export class CannotSetInternalVariableCodxError extends CodxError {
  constructor(name: string) {
    super(`Cannot set internal variable "${name}"`);
    this.name = 'CannotSetInternalVariableCodxError';
  }
}
