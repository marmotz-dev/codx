/**
 * Error thrown when attempting to set an internal variable with an invalid name
 */
import { CodxError } from '@/core/CodxError';

export class CannotUnsetInternalVariableWithInvalidNameCodxError extends CodxError {
  constructor(name: string) {
    super(`Cannot unset an internal variable "${name}" that does not start with a $`);
    this.name = 'CannotUnsetInternalVariableWithInvalidNameCodxError';
  }
}
