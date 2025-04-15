/**
 * Error thrown when finding a recipe fails
 */
import { CodxError } from '@/core/CodxError';

export class RecipeFindFailedCodxError extends CodxError {
  constructor(error?: unknown) {
    super('Failed to find recipe', error);
    this.name = 'RecipeFindFailedCodxError';
  }
}
