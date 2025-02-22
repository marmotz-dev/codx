import chalk from 'chalk';

export class LoggerService {
  private indent = 0;

  check(message: string) {
    this.log(this.iconCheck(), message);
  }

  checkGroup(message: string) {
    this.group(this.iconCheck(), message);
  }

  checkGroupEnd(message: string) {
    this.groupEnd(this.iconCheck(), message);
  }

  error(message: string) {
    this.log(this.iconError(), message);
  }

  errorGroup(message: string) {
    this.group(this.iconError(), message);
  }

  errorGroupEnd(message: string) {
    this.groupEnd(this.iconError(), message);
  }

  info(message: string) {
    this.log(this.iconInfo(), message);
  }

  infoGroup(message: string) {
    this.group(this.iconInfo(), message);
  }

  infoGroupEnd(message: string) {
    this.groupEnd(this.iconInfo(), message);
  }

  success(message: string) {
    this.log(this.iconSuccess(), message);
  }

  successGroup(message: string) {
    this.group(this.iconSuccess(), message);
  }

  successGroupEnd(message: string) {
    this.groupEnd(this.iconSuccess(), message);
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

  private iconCheck() {
    return chalk.yellow('⚡ ');
  }

  private iconError() {
    return chalk.red('✗ ');
  }

  private iconInfo() {
    return chalk.blue('ℹ ');
  }

  private iconSuccess() {
    return chalk.green('✓ ');
  }

  private log(icon: string, message: string) {
    console.log(this.getIndent() + icon + message);
  }
}

export const loggerService = new LoggerService();
