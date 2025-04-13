/**
 * Error thrown when a regular expression pattern is invalid
 */
import { CodxError } from '@/core/CodxError';

export class InvalidRegexPatternCodxError extends CodxError {
  constructor(pattern: string, error: Error) {
    super(`Invalid regular expression pattern "${pattern}"`, error);
    this.name = 'InvalidRegexPatternCodxError';
  }
}
