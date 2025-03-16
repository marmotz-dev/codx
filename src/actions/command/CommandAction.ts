import { BaseCommandAction } from '@/actions/BaseCommandAction';
import { CommandActionData } from '@/actions/command/CommandAction.schema';

/**
 * Action to execute a system command
 */
export class CommandAction extends BaseCommandAction {
  /**
   * Executes the system command
   * @param {CommandActionData} actionData Action data
   */
  public async execute(actionData: CommandActionData) {
    const { command } = actionData;

    return this.executeCommand(command);
  }
}
