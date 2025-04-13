/**
 * Error thrown when message option is missing
 */
import { MissingParameterCodxError } from './MissingParameterCodxError';

export class MissingMessageCodxError extends MissingParameterCodxError {
  constructor() {
    super('Message');
    this.name = 'MissingMessageCodxError';
  }
}
