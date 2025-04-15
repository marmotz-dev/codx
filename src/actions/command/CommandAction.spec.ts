import { CommandAction } from '@/actions/command/CommandAction';
import { CommandActionData } from '@/actions/command/CommandAction.schema';
import { diContainer } from '@/di/Container';
import { describe, expect, mock, test } from 'bun:test';

describe('CommandAction', () => {
  test('should execute command with provided data', async () => {
    const mockCommand = 'test command';
    // Create a spy on the executeCommand method
    const executeCommandSpy = mock();

    // Create a CommandAction instance with the spy
    const action = diContainer.get(CommandAction);

    // Replace the executeCommand method with our spy
    (action as any).executeCommand = executeCommandSpy;

    // Execute the action
    await action.execute({
      type: 'command',
      command: mockCommand,
    } as CommandActionData);

    // Verify executeCommand was called with the correct parameters
    expect(executeCommandSpy).toHaveBeenCalledWith(mockCommand);
  });

  test('should execute command without working directory', async () => {
    const mockCommand = 'test command';

    // Create a spy on the executeCommand method
    const executeCommandSpy = mock();

    // Create a CommandAction instance with the spy
    const action = diContainer.get(CommandAction);

    // Replace the executeCommand method with our spy
    (action as any).executeCommand = executeCommandSpy;

    // Execute the action
    await action.execute({
      type: 'command',
      command: mockCommand,
    } as CommandActionData);

    // Verify executeCommand was called with the correct parameters
    expect(executeCommandSpy).toHaveBeenCalledWith(mockCommand);
  });
});
