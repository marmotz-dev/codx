import { consoleLogAction } from '@/actions/console/log';
import { describe, expect, it, spyOn } from 'bun:test';

describe('log action', () => {
  it('should log the message', async () => {
    const consoleSpy = spyOn(console, 'log');
    await consoleLogAction({ args: ['Hello World'], recipeDirectory: '', projectDirectory: '' });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should throw error when text is missing', async () => {
    const result = consoleLogAction({ args: [], recipeDirectory: '', projectDirectory: '' });
    expect(result).rejects.toThrow('A text list is required for the "log" action');
  });
});
