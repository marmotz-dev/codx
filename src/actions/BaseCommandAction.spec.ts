import { BaseCommandAction } from '@/actions/BaseCommandAction';
import { CommandCancelledCodxError } from '@/core/errors/CommandCancelledCodxError';
import { CommandExecutionCodxError } from '@/core/errors/CommandExecutionCodxError';
import { Store } from '@/core/Store';
import { diContainer } from '@/di/Container';
import { MockCleaner, mockModule } from '@/testHelpers/mockModule';
import { setupConsole } from '@/testHelpers/setupConsole';
import { setupWorkingDirectories } from '@/testHelpers/setupWorkingDirectories';
import { confirm } from '@inquirer/prompts';
import { afterEach, beforeEach, describe, expect, Mock, mock, spyOn, test } from 'bun:test';
import { spawnSync } from 'node:child_process';

// Create a concrete implementation of BaseCommandAction for testing
class TestCommandAction extends BaseCommandAction {
  public async execute(): Promise<void> {
    // Not used in tests
  }
}

describe('BaseCommandAction', () => {
  const { mockProjectDir } = setupWorkingDirectories();
  setupConsole();

  const mockCommand = 'test command';
  const interpolatedCommand = 'interpolated test command';
  let mockChildProcessCleaner: MockCleaner;
  let mockInquirerCleaner: MockCleaner;
  let mockInquirerConfirm: Mock<any>;
  let action: TestCommandAction;

  beforeEach(async () => {
    const mockStore = diContainer.get(Store);
    spyOn(mockStore, 'interpolate').mockImplementation((value) => {
      if (value === mockCommand) {
        return interpolatedCommand;
      }

      return value;
    });

    mockInquirerConfirm = mock().mockResolvedValue(true);
    mockInquirerCleaner = await mockModule('@inquirer/prompts', () => ({
      confirm: mockInquirerConfirm,
    }));

    mockChildProcessCleaner = await mockModule('child_process', () => ({
      spawnSync: mock().mockImplementation((_cmd, _options, callback) => {
        // Simulate successful command execution
        callback(null);

        // Return a mock child process
        return {
          stdout: {
            pipe: mock(),
          },
          stderr: {
            pipe: mock(),
          },
        };
      }),
    }));

    action = diContainer.get(TestCommandAction);
  });

  afterEach(() => {
    mockChildProcessCleaner();
    mockInquirerCleaner();
    mock.restore();
  });

  describe('executeCommand', () => {
    test('should execute command with confirmation', async () => {
      const spyRunCommand = spyOn(action as any, 'runCommand').mockResolvedValue(undefined);

      await action['executeCommand'](mockCommand);

      const mockStore = diContainer.get(Store);
      expect(mockStore.interpolate).toHaveBeenCalledWith(mockCommand);
      expect(confirm).toHaveBeenCalled();
      expect(spyRunCommand).toHaveBeenCalledWith(interpolatedCommand, mockProjectDir);
    });

    test('should execute command without confirmation when confirm is false', async () => {
      const spyRunCommand = spyOn(action as any, 'runCommand').mockResolvedValue(undefined);

      await action['executeCommand'](mockCommand, false);

      expect(confirm).not.toHaveBeenCalled();

      expect(spyRunCommand).toHaveBeenCalled();
    });

    test('should throw error when user cancels confirmation', async () => {
      mockInquirerConfirm.mockResolvedValue(false);

      expect(action['executeCommand'](mockCommand)).rejects.toThrow(CommandCancelledCodxError);
      expect(action['executeCommand'](mockCommand)).rejects.toThrow('Command execution cancelled by user.');

      expect(spawnSync).not.toHaveBeenCalled();
    });

    test('should throw error when command execution fails', async () => {
      const mockErrorMessage = 'Command execution failed';
      const mockError = new Error(mockErrorMessage);

      spyOn(action as any, 'runCommand').mockRejectedValue(mockError);

      expect(action['executeCommand'](mockCommand, false)).rejects.toThrow(CommandExecutionCodxError);
      expect(action['executeCommand'](mockCommand, false)).rejects.toThrow('Error executing command');
    });
  });

  describe('runCommand', () => {
    const mockCommand = 'test command';
    const mockCwd = '/test/dir';

    test('should resolve with status code and output when command succeeds', async () => {
      const mockOutput = ['stdout', 'stderr'];
      (spawnSync as Mock<any>).mockReturnValue({
        status: 0,
        output: mockOutput,
        error: null,
      });

      const result = await action['runCommand'](mockCommand, mockCwd);

      expect(spawnSync).toHaveBeenCalledWith(mockCommand, { shell: true, cwd: mockCwd });
      expect(result).toEqual({
        code: 0,
        output: mockOutput.toString(),
      });
    });

    test('should resolve with non-zero status code when command fails but no error', async () => {
      const mockOutput = ['stdout', 'stderr'];
      (spawnSync as Mock<any>).mockReturnValue({
        status: 1,
        output: mockOutput,
        error: null,
      });

      const result = await action['runCommand'](mockCommand, mockCwd);

      expect(spawnSync).toHaveBeenCalledWith(mockCommand, { shell: true, cwd: mockCwd });
      expect(result).toEqual({
        code: 1,
        output: mockOutput.toString(),
      });
    });

    test('should reject with error when command execution fails', async () => {
      const mockError = new Error('Command execution failed');
      (spawnSync as Mock<any>).mockReturnValue({
        status: null,
        output: [],
        error: mockError,
      });

      expect(action['runCommand'](mockCommand, mockCwd)).rejects.toEqual(mockError);
      expect(spawnSync).toHaveBeenCalledWith(mockCommand, { shell: true, cwd: mockCwd });
    });
  });
});
