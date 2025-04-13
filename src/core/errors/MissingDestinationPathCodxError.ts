/**
 * Error thrown when destination path option is missing
 */
import { MissingParameterCodxError } from './MissingParameterCodxError';

export class MissingDestinationPathCodxError extends MissingParameterCodxError {
  constructor() {
    super('Destination path');
    this.name = 'MissingDestinationPathCodxError';
  }
}
