import { log } from '@/steps/log';
import { describe, expect, spyOn, test } from 'bun:test';

describe('log step', () => {
  test('should log the message', async () => {
    const consoleSpy = spyOn(console, 'log');
    await log({ args: ['Hello World'], recipeDirectory: '', projectDirectory: '' });
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('should throw error when text is missing', async () => {
    const result = log({ args: [], recipeDirectory: '', projectDirectory: '' });
    expect(result).rejects.toThrow('A text list is required for the "log" step');
  });
});
