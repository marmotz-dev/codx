/**
 * Error thrown when source path option is missing
 */
import { MissingParameterCodxError } from './MissingParameterCodxError';

export class MissingSourcePathCodxError extends MissingParameterCodxError {
  constructor() {
    super('Source path');
    this.name = 'MissingSourcePathCodxError';
  }
}
