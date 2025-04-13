/**
 * Error thrown when an explicit failure is triggered
 */
import { CodxError } from '@/core/CodxError';

export class ExplicitFailureCodxError extends CodxError {
  constructor(message: string) {
    super(message);
    this.name = 'ExplicitFailureCodxError';
  }
}
