import { shell } from '@/services/shell';
import { describe, expect, it } from 'bun:test';

describe('shell function', () => {
  it('should execute a simple shell command successfully', async () => {
    const { stdout } = await shell('echo "Hello, world!"');

    expect(stdout.toString().trim()).toBe('Hello, world!');
  });

  it('should handle commands with multiple arguments', async () => {
    const { stdout, exitCode } = await shell('ls -l');

    expect(stdout).toBeDefined();
    expect(exitCode).toBe(0);
  });

  it('should return an error for invalid commands', async () => {
    const { error, exitCode, stdout, stderr } = await shell('non-existent-command');

    expect(error).toBeInstanceOf(Error);
    expect(exitCode).toBe(127);
    expect(stdout).toBe('');
    expect(stderr).not.toBe('');
  });

  it('should correctly handle command with pipes', async () => {
    const result = await shell('echo "test" | wc -c');

    expect(result.stdout.toString().trim()).toBe('5');
  });
});
