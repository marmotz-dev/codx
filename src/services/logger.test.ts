import { LoggerService } from '@/services/logger';
import { afterEach, beforeEach, describe, expect, it, Mock, spyOn } from 'bun:test';
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

  afterEach(() => {
    LoggerService['instance'] = undefined;
  });

  describe('Log Methods', () => {
    it('should log "check" message with yellow lightning bolt', () => {
      logger.check('This is a "check" message test');
      expect(consoleLogSpy).toHaveBeenCalledWith(chalk.yellow('⚡ ') + 'This is a "check" message test');
    });

    it('should log "error" message with red cross', () => {
      logger.error('This is a "error" message test');
      expect(consoleErrorSpy).toHaveBeenCalledWith(chalk.red('✗ ') + 'This is a "error" message test');
    });

    it('should log "info" message with blue info symbol', () => {
      logger.info('This is a "info" message test');
      expect(consoleLogSpy).toHaveBeenCalledWith(chalk.blue('ℹ ') + 'This is a "info" message test');
    });

    it('should log "log" message with blue info symbol', () => {
      logger.log('This is a "log" message test');
      expect(consoleLogSpy).toHaveBeenCalledWith(chalk.white('⬤ ') + 'This is a "log" message test');
    });

    it('should log "success" message with green check mark', () => {
      logger.success('This is a "success" message test');
      expect(consoleLogSpy).toHaveBeenCalledWith(chalk.green('✓ ') + 'This is a "success" message test');
    });
  });

  describe('Group Methods', () => {
    it('should create an info group with correct indentation', () => {
      expect(logger['indent']).toBe(0);

      logger.infoGroup('Starting info group');

      expect(consoleLogSpy).toHaveBeenCalledWith(chalk.blue('ℹ ') + 'Starting info group');
      expect(logger['indent']).toBe(1);
    });

    it('should create a log group with correct indentation', () => {
      expect(logger['indent']).toBe(0);

      logger.logGroup('Starting log group');

      expect(consoleLogSpy).toHaveBeenCalledWith(chalk.white('⬤ ') + 'Starting log group');
      expect(logger['indent']).toBe(1);
    });

    it('should end error group with correct indentation and icon', () => {
      expect(logger['indent']).toBe(0);

      // Simulate a group first
      logger.infoGroup('Test Group');
      logger.errorGroupEnd('Ending error group');

      expect(consoleLogSpy).toHaveBeenCalledWith(chalk.grey('└') + ' ' + chalk.red('✗ ') + 'Ending error group');
      expect(logger['indent']).toBe(0);
    });

    it('should end success group with correct indentation and icon', () => {
      expect(logger['indent']).toBe(0);

      // Simulate a group first
      logger.infoGroup('Test Group');
      logger.successGroupEnd('Ending success group');

      expect(consoleLogSpy).toHaveBeenCalledWith(chalk.grey('└') + ' ' + chalk.green('✓ ') + 'Ending success group');
      expect(logger['indent']).toBe(0);
    });
  });

  describe('Indentation Method', () => {
    it('should return empty string when indent is 0', () => {
      expect(logger['getIndent'].call(logger)).toBe('');
    });

    it('should return correct indentation with default char', () => {
      // Simulate increasing indent
      logger['indent'] = 2;

      const indentResult = logger['getIndent']();

      expect(indentResult).toBe(chalk.grey('│ ') + chalk.grey('├') + ' ');
    });

    it('should return correct end indentation', () => {
      // Simulate increasing indent
      logger['indent'] = 2;

      const indentResult = logger['getEndIndent']();

      expect(indentResult).toBe(chalk.grey('│ ') + chalk.grey('└') + ' ');
    });
  });
});
