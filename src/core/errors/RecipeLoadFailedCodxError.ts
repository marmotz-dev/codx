/**
 * Error thrown when loading a recipe fails
 */
import { CodxError } from '@/core/CodxError';

export class RecipeLoadFailedCodxError extends CodxError {
  constructor(error?: unknown) {
    super('Failed to load recipe', error);
    this.name = 'RecipeLoadFailedCodxError';
  }
}
