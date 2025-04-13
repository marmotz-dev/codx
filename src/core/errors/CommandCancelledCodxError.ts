/**
 * Error thrown when user cancel command execution
 */
import { CodxError } from '@/core/CodxError';

export class CommandCancelledCodxError extends CodxError {
  constructor() {
    super('Command execution cancelled by user.');
    this.name = 'CommandCancelledCodxError';
  }
}
