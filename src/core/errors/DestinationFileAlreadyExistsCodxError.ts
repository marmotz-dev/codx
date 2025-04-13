/**
 * Error thrown when a destination file already exists and overwrite is not enabled
 */
import { CodxError } from '@/core/CodxError';

export class DestinationFileAlreadyExistsCodxError extends CodxError {
  constructor(path: string) {
    super(`Destination file "${path}" already exists and the "overwrite" option is not enabled.`);
    this.name = 'DestinationFileAlreadyExistsCodxError';
  }
}
