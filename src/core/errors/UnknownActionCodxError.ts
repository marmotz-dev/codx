/**
 * Error thrown when an unknown action is executed
 */
import { CodxError } from '@/core/CodxError';

export class UnknownActionCodxError extends CodxError {
  constructor(action: string) {
    super(`Unknown action: ${action}`);
    this.name = 'UnknownActionCodxError';
  }
}
