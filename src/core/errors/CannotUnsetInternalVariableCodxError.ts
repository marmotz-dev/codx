/**
 * Error thrown when attempting to unset an internal variable
 */
import { CodxError } from '@/core/CodxError';

export class CannotUnsetInternalVariableCodxError extends CodxError {
  constructor(name: string) {
    super(`Cannot unset internal variable "${name}"`);
    this.name = 'CannotUnsetInternalVariableCodxError';
  }
}
