/**
 * Error thrown when attempting to unset an internal variable with an invalid name
 */
import { CodxError } from '@/core/CodxError';

export class CannotSetInternalVariableWithInvalidNameCodxError extends CodxError {
  constructor(name: string) {
    super(`Cannot set an internal variable "${name}" that does not start with a $`);
    this.name = 'CannotSetInternalVariableWithInvalidNameCodxError';
  }
}
