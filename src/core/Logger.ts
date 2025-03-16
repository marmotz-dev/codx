import chalk from 'chalk';

type MessageStyle = 'header' | 'info' | 'success' | 'warning' | 'error' | 'default';

/**
 * Utility class for managing logs in the application
 */
export class Logger {
  private verbose: boolean = false;

  /**
   * Displays a debug message only if verbose mode is enabled
   *
   * @param {string} message The message to display
   */
  debug(message: string): void {
    if (this.verbose) {
      console.log(chalk.green('🔍 ' + message));
    }
  }

  /**
   * Displays an error message
   *
   * @param {string} message The message to display
   */
  error(message: any): void {
    console.error(chalk.red('✗ ') + message);
  }

  /**
   * Displays a header (title)
   *
   * @param {string} message The message to display
   */
  header(message: string): void {
    console.log(chalk.bold.cyan('# ' + message));
  }

  /**
   * Displays an info message
   *
   * @param {string} message The message to display
   */
  info(message: string): void {
    console.log(chalk.blue('ℹ ') + message);
  }

  /**
   * Displays a message with a specific style
   *
   * @param {string} message The message to display
   * @param {MessageStyle} style The style to apply
   */
  message(message: string = '', style: MessageStyle = 'default'): void {
    switch (style) {
      case 'header':
        this.header(message);
        break;
      case 'info':
        this.info(message);
        break;
      case 'success':
        this.success(message);
        break;
      case 'warning':
        this.warning(message);
        break;
      case 'error':
        this.error(message);
        break;
      case 'default':
      default:
        console.log(message);
        break;
    }
  }

  setVerbose() {
    this.verbose = true;
  }

  /**
   * Displays a success message
   *
   * @param {string} message The message to display
   */
  success(message: string): void {
    console.log(chalk.green('✓ ') + message);
  }

  /**
   * Displays a warning message
   *
   * @param {string} message The message to display
   */
  warning(message: string): void {
    console.log(chalk.yellow('⚠ ') + message);
  }
}
