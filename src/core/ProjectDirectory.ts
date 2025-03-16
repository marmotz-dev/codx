import { WorkingDirectory } from '@/core/WorkingDirectory';

export class ProjectDirectory extends WorkingDirectory {
  private initialDirectory!: string;

  /**
   * Creates a new ProjectDirectory instance
   * @param initialDirectory The initial working directory (defaults to current process directory)
   */
  constructor(initialDirectory: string = '.') {
    super(initialDirectory);
  }

  /**
   * Changes the current working directory
   * @param directory New working directory (absolute or relative)
   * @throws {Error} If the directory does not exist or is not a directory
   */
  public change(directory: string): void {
    // Resolve the new directory path
    const newDir = this.resolve(directory);

    // Validate the new directory
    this.validateDirectory(newDir);

    // Update the current directory
    this.currentDirectory = newDir;

    this.notifyObservers(newDir);
  }

  public init(dir: string) {
    super.init(dir);

    this.initialDirectory = this.currentDirectory;
  }

  /**
   * Resets the working directory to the initial directory
   */
  public reset(): void {
    this.currentDirectory = this.initialDirectory;

    this.notifyObservers(this.currentDirectory);
  }

  protected isAllowedPath(path: string): boolean {
    return path.startsWith(this.initialDirectory);
  }
}
