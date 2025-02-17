import { log } from '@/steps/log';
import { describe, expect, it, spyOn } from 'bun:test';

describe('log step', () => {
  it('should log the message', async () => {
    const consoleSpy = spyOn(console, 'log');
    await log({ args: ['Hello World'], recipeDirectory: '', projectDirectory: '' });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should throw error when text is missing', async () => {
    const result = log({ args: [], recipeDirectory: '', projectDirectory: '' });
    expect(result).rejects.toThrow('A text list is required for the "log" step');
  });
});
