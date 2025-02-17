import chalk from 'chalk';

export class LoggerService {
  private static instance?: LoggerService;

  private indent = 0;

  private constructor() {}

  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }

    return LoggerService.instance;
  }

  check(message: string) {
    console.log(this.getIndent() + this.checkIcon() + message);
  }

  error(message: string) {
    console.error(this.getIndent() + this.errorIcon() + message);
  }

  errorGroupEnd(message: string) {
    this.groupEnd(this.errorIcon(), message);
  }

  info(message: string) {
    console.log(this.getIndent() + this.infoIcon() + message);
  }

  infoGroup(message: string) {
    this.group(this.infoIcon(), message);
  }

  log(message: string) {
    console.log(this.getIndent() + this.logIcon() + message);
  }

  logGroup(message: string) {
    this.group(this.logIcon(), message);
  }

  success(message: string) {
    console.log(this.getIndent() + this.successIcon() + message);
  }

  successGroupEnd(message: string) {
    this.groupEnd(this.successIcon(), message);
  }

  private checkIcon() {
    return chalk.yellow('⚡ ');
  }

  private errorIcon() {
    return chalk.red('✗ ');
  }

  private getEndIndent() {
    return this.getIndent('└');
  }

  private getIndent(char = '├') {
    if (this.indent === 0) {
      return '';
    }

    let indent = '';

    if (this.indent - 1 > 0) {
      indent += chalk.grey('│ ').repeat(this.indent - 1);
    }

    indent += chalk.grey(char) + ' ';

    return indent;
  }

  private group(icon: string, message: string) {
    console.log(this.getIndent() + icon + message);
    this.indent++;
  }

  private groupEnd(icon: string, message: string) {
    console.log(this.getEndIndent() + icon + message);
    this.indent--;
  }

  private infoIcon() {
    return chalk.blue('ℹ ');
  }

  private logIcon() {
    return chalk.white('⬤ ');
  }

  private successIcon() {
    return chalk.green('✓ ');
  }
}
