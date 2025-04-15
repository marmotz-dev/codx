/**
 * Error thrown when a dependency is not found
 */
import { CodxError } from '@/core/CodxError';

export class DependencyNotFoundCodxError extends CodxError {
  constructor(token: any) {
    super(`Dependency not found for the token: ${token}`);
    this.name = 'DependencyNotFoundCodxError';
  }
}
