import { loggerService } from '@/services/logger';
import { argsToContext } from '@/test-helpers/actionContext';
import { beforeEach, describe, expect, it, jest } from 'bun:test';
import { LoggerActions } from './logger';

describe('Logger', () => {
  const multiTextMethods = ['check', 'error', 'info', 'success'] as const;
  const singleTextMethods = multiTextMethods.map((method) => [method + 'Group', method + 'GroupEnd']).flat();

  // Mock loggerService
  const mockLoggerService = Object.fromEntries(
    [...multiTextMethods, ...singleTextMethods].map((method) => [method, jest.fn()] as const),
  );

  // Replace the real loggerService with our mock
  Object.assign(loggerService, mockLoggerService);

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  multiTextMethods.forEach((method) => {
    describe(`${method} method`, () => {
      it(`should call loggerService.${method} with the provided text`, async () => {
        const texts = ['test message'];
        await LoggerActions[method](argsToContext(texts));
        expect(mockLoggerService[method]).toHaveBeenCalledWith(texts[0]);
      });

      it(`should throw an error when no text is provided`, async () => {
        expect(LoggerActions[method](argsToContext([]))).rejects.toThrow('A text list is required for logger actions');
      });

      it(`should handle multiple texts`, async () => {
        const texts = ['message 1', 'message 2'];
        await LoggerActions[method](argsToContext(texts));
        expect(mockLoggerService[method]).toHaveBeenCalledTimes(2);
        expect(mockLoggerService[method]).toHaveBeenNthCalledWith(1, texts[0]);
        expect(mockLoggerService[method]).toHaveBeenNthCalledWith(2, texts[1]);
      });
    });
  });

  singleTextMethods.forEach((method) => {
    describe(`${method} method`, () => {
      it(`should call loggerService.${method} with the provided text`, async () => {
        const text = 'test message';
        await (LoggerActions as any)[method](argsToContext<string>(text));
        expect((mockLoggerService as any)[method]).toHaveBeenCalledWith(text);
      });

      it(`should throw an error when no text is provided`, async () => {
        expect((LoggerActions as any)[method](argsToContext<string>(''))).rejects.toThrow(
          'A text is required for logger actions',
        );
      });
    });
  });
});
