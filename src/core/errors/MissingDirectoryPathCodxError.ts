/**
 * Error thrown when directory path option is missing
 */
import { MissingParameterCodxError } from './MissingParameterCodxError';

export class MissingDirectoryPathCodxError extends MissingParameterCodxError {
  constructor() {
    super('Directory path');
    this.name = 'MissingDirectoryPathCodxError';
  }
}
