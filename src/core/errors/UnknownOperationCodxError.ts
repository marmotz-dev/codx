/**
 * Error thrown when an operation is not recognized
 */
import { CodxError } from '@/core/CodxError';

export class UnknownOperationCodxError extends CodxError {
  constructor(operation: string) {
    super(`Unknown operation: ${operation}`);
    this.name = 'UnknownOperationCodxError';
  }
}
