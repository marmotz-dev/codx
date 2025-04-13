/**
 * Error thrown when command fail
 */
import { CodxError } from '@/core/CodxError';

export class CommandExecutionCodxError extends CodxError {
  constructor(error: Error) {
    super('Error executing command', error);
    this.name = 'CommandExecutionCodxError';
  }
}
