import { DirectoryNotFoundCodxError } from '@/core/errors/DirectoryNotFoundCodxError';
import { NotADirectoryCodxError } from '@/core/errors/NotADirectoryCodxError';
import { PathOutsideWorkingDirectoryCodxError } from '@/core/errors/PathOutsideWorkingDirectoryCodxError';
import { IObserver } from '@/core/Observer.interface';
import { existsSync, statSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

type WorkingDirectoryObserver = IObserver<string>;

/**
 * Manages working directory with robust path resolution and validation
 */
export class WorkingDirectory {
  protected currentDirectory!: string;
  private readonly observers: WorkingDirectoryObserver[] = [];

  /**
   * Creates a new WorkingDirectory instance
   * @param initialDirectory The initial working directory (defaults to current process directory)
   */
  constructor(initialDirectory: string = process.cwd()) {
    this.init(initialDirectory);
  }

  /**
   * Gets the current working directory
   * @returns The current working directory path
   */
  public get(): string {
    return this.currentDirectory;
  }

  public init(dir: string) {
    this.currentDirectory = resolve(dir);

    this.validateDirectory(this.currentDirectory);

    this.notifyObservers(this.currentDirectory);
  }

  public notifyObserver(observer: WorkingDirectoryObserver, directory: string) {
    observer.notify(directory);
  }

  public notifyObservers(directory: string) {
    this.observers.forEach((observer) => {
      observer.notify(directory);
    });
  }

  public observe(observer: WorkingDirectoryObserver) {
    this.observers.push(observer);

    this.notifyObserver(observer, this.currentDirectory);
  }

  /**
   * Resolves a path relative to the current working path or return path if it's absolute
   * @param path Path to resolve
   * @returns Absolute path
   */
  public resolve(path: string): string {
    const newPath = isAbsolute(path) ? resolve(path) : resolve(this.currentDirectory, path);

    if (!this.isAllowedPath(newPath)) {
      throw new PathOutsideWorkingDirectoryCodxError(newPath);
    }

    return newPath;
  }

  protected isAllowedPath(path: string): boolean {
    return path.startsWith(this.currentDirectory);
  }

  /**
   * Validates if a given path is a valid directory
   * @param directoryPath Path to validate
   * @throws {Error} If the path does not exist or is not a directory
   */
  protected validateDirectory(directoryPath: string): void {
    // Check if the directory exists
    if (!existsSync(directoryPath)) {
      throw new DirectoryNotFoundCodxError(directoryPath);
    }

    // Check if the path is a directory
    const stats = statSync(directoryPath);
    if (!stats.isDirectory()) {
      throw new NotADirectoryCodxError(directoryPath);
    }
  }
}
