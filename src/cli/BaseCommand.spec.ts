import { diContainer } from '@/di/Container';
import { describe, expect, spyOn, test } from 'bun:test';
import chalk from 'chalk';
import { BaseCommand } from './BaseCommand'; // Update the import path if needed

// Create a concrete implementation of BaseCommand for testing
class TestCommand extends BaseCommand {
  public executionCount = 0;
  public shouldThrowError = false;
  public customError: Error | string | null = null;

  async doExecute(): Promise<void> {
    this.executionCount++;

    if (this.shouldThrowError) {
      if (this.customError instanceof Error) {
        throw this.customError;
      } else if (typeof this.customError === 'string') {
        throw this.customError;
      } else {
        throw new Error('Test error');
      }
    }
  }
}

describe('BaseCommand', () => {
  test('BaseCommand should execute doExecute method', async () => {
    const command = diContainer.get(TestCommand);
    await command.execute();
    expect(command.executionCount).toBe(1);
  });

  test('BaseCommand should pass arguments to doExecute', async () => {
    const command = diContainer.get(TestCommand);
    const doExecuteSpy = spyOn(command, 'doExecute');

    await command.execute('arg1', 42, { key: 'value' });

    expect(doExecuteSpy).toHaveBeenCalledWith('arg1', 42, { key: 'value' });
  });

  test('BaseCommand should catch Error instances and log the error message', async () => {
    const command = diContainer.get(TestCommand);
    command.shouldThrowError = true;
    command.customError = new Error('Custom error message');

    const consoleSpy = spyOn(console, 'error');

    await command.execute();

    expect(consoleSpy).toHaveBeenCalledWith(chalk.red('✗ ') + 'Custom error message');
  });

  test('BaseCommand should catch non-Error exceptions and log them directly', async () => {
    const command = diContainer.get(TestCommand);
    command.shouldThrowError = true;
    command.customError = 'String error';

    const consoleSpy = spyOn(console, 'error');

    await command.execute();

    expect(consoleSpy).toHaveBeenCalledWith(chalk.red('✗ ') + 'String error');
  });

  test('BaseCommand should not throw exceptions outside of execute', async () => {
    const command = diContainer.get(TestCommand);
    command.shouldThrowError = true;

    // This should not throw
    expect(command.execute()).resolves.toBeUndefined();
  });
});
