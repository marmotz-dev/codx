/**
 * Error thrown when content option is missing
 */
import { MissingParameterCodxError } from './MissingParameterCodxError';

export class MissingContentCodxError extends MissingParameterCodxError {
  constructor() {
    super('Content');
    this.name = 'MissingContentCodxError';
  }
}
