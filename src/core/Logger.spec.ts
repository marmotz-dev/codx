import { Logger } from '@/core/Logger';
import { afterEach, beforeEach, describe, expect, it, spyOn } from 'bun:test';

describe('Logger', () => {
  let logger: Logger;
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    logger = new Logger();
    logger.setVerbose();
    consoleLogSpy = spyOn(console, 'log');
    consoleLogSpy.mockReset();
    consoleErrorSpy = spyOn(console, 'error');
    consoleErrorSpy.mockReset();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should log info messages', () => {
    logger.info('Test info message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should log success messages', () => {
    logger.success('Test success message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should log warning messages', () => {
    logger.warning('Test warning message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    logger.error('Test error message');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should log header messages', () => {
    logger.header('Test header message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should log debug messages when verbose is true', () => {
    logger.debug('Test debug message');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should not log debug messages when verbose is false', () => {
    const nonVerboseLogger = new Logger();
    const spy = spyOn(console, 'log');
    spy.mockReset();

    nonVerboseLogger.debug('Test debug message');
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });

  it('should handle different message styles', () => {
    logger.message('Test default message');
    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockClear();

    logger.message('Test header message', 'header');
    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockClear();

    logger.message('Test info message', 'info');
    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockClear();

    logger.message('Test success message', 'success');
    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockClear();

    logger.message('Test warning message', 'warning');
    expect(consoleLogSpy).toHaveBeenCalled();
    consoleLogSpy.mockClear();

    logger.message('Test error message', 'error');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
