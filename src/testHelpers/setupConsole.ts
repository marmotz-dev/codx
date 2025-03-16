import { afterEach, beforeEach, mock } from 'bun:test';

export function setupConsole() {
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;

  let mockConsoleLog = mock();
  let mockConsoleError = mock();

  beforeEach(() => {
    originalConsoleLog = console.log;
    originalConsoleError = console.error;

    console.log = mockConsoleLog;
    console.error = mockConsoleError;
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  return {
    mockConsoleLog,
    mockConsoleError,
  };
}
