/**
 * Error thrown when a parameter option is missing
 */
import { CodxError } from '@/core/CodxError';

export class MissingParameterCodxError extends CodxError {
  constructor(parameter: string) {
    super(`${parameter.substring(0, 1).toUpperCase() + parameter.substring(1)} is required for this action`);
    this.name = 'MissingParameterCodxError';
  }
}
