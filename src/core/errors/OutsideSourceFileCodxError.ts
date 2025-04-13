/**
 * Error thrown when source file is outside recipe or project directory
 */
import { CodxError } from '@/core/CodxError';

export class OutsideSourceFileCodxError extends CodxError {
  constructor(path: string) {
    super(`Source file "${path}" is neither in the recipe directory nor in the project directory.`);
    this.name = 'OutsideSourceFileCodxError';
  }
}
