import { CodxError } from '@/core/CodxError';
import { describe, expect, test } from 'bun:test';

describe('CodxError', () => {
  test('creates an error with a simple message', () => {
    const error = new CodxError('Basic error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CodxError);
    expect(error.name).toBe('CodxError');
    expect(error.message).toBe('Basic error');
  });

  test('appends Error message when previous is an Error', () => {
    const previousError = new Error('Original error');
    const error = new CodxError('Wrapper error', previousError);

    expect(error.message).toBe('Wrapper error: Original error');
  });

  test('appends string message when previous is a string', () => {
    const error = new CodxError('Wrapper error', 'Additional info');

    expect(error.message).toBe('Wrapper error: Additional info');
  });

  test('appends JSON stringified object when previous is an object', () => {
    const previousObject = { code: 404, status: 'Not Found' };
    const error = new CodxError('Wrapper error', previousObject);

    expect(error.message).toBe(`Wrapper error: ${JSON.stringify(previousObject)}`);
  });

  test('handles undefined previous argument', () => {
    const error = new CodxError('Error without previous');

    expect(error.message).toBe('Error without previous');
  });
});
