/**
 * Error thrown when a recipe schema is invalid
 */
import { CodxError } from '@/core/CodxError';
import { z, ZodError } from 'zod';

export class InvalidRecipeSchemaCodxError extends CodxError {
  constructor(error: ZodError) {
    const formattedError = z
      .prettifyError(error)
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');

    super(`Invalid recipe schema:\n${formattedError}`);
    this.name = 'InvalidRecipeSchemaCodxError';
  }
}
