import { LoggerService } from '@/services/logger';
import { beforeEach, describe, expect, Mock, spyOn, test } from 'bun:test';
import chalk from 'chalk';

type MockConsole = Mock<{
  (...data: never[]): void;
  (message?: never, ...optionalParams: never[]): void;
  (...data: never[]): void;
}>;

describe('LoggerService', () => {
  let logger: LoggerService;
  let consoleLogSpy: MockConsole;
  let consoleErrorSpy: MockConsole;

  beforeEach(() => {
    logger = LoggerService.getInstance();
    consoleLogSpy = spyOn(console, 'log');
    consoleErrorSpy = spyOn(console, 'error');
  });

  test('should log success message with green check mark', () => {
    logger.success('This is a success message test');
    expect(consoleLogSpy).toHaveBeenCalledWith(chalk.green('✓ ') + 'This is a success message test');
  });

  test('should log error message with red cross', () => {
    logger.error('This is a error message test');
    expect(consoleErrorSpy).toHaveBeenCalledWith(chalk.red('✗ ') + 'This is a error message test');
  });

  test('should log info message with blue info symbol', () => {
    logger.info('This is a info message test');
    expect(consoleLogSpy).toHaveBeenCalledWith(chalk.blue('ℹ ') + 'This is a info message test');
  });

  test('should log check message with yellow lightning bolt', () => {
    logger.check('This is a check message test');
    expect(consoleLogSpy).toHaveBeenCalledWith(chalk.yellow('⚡ ') + 'This is a check message test');
  });
});
