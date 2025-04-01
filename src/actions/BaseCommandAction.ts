import { BaseAction } from '@/actions/BaseAction';
import { CodxError } from '@/core/CodxError';
import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { spawnSync } from 'node:child_process';

/**
 * Action to run npm packages
 */
export abstract class BaseCommandAction extends BaseAction {
  /**
   * Executes a command
   * @param command The npm command to execute
   * @param needConfirmation
   * @returns A promise that resolves when the command completes
   */
  protected async executeCommand(command: string, needConfirmation = true) {
    const interpolatedCommand = this.interpolate(command);
    const currentProjectDirectory = this.context.projectDirectory.get();

    if (needConfirmation) {
      this.logger.info(
        `Preparing to execute command: ${chalk.yellow(interpolatedCommand)} in ${chalk.grey.bold(currentProjectDirectory)}`,
      );

      const confirmExecution = await confirm({
        message: 'Are you sure you want to execute this command?',
        default: true,
      });

      if (!confirmExecution) {
        throw new CodxError('Command execution cancelled by user.');
      }
    } else {
      this.logger.info(
        `Executing command: ${chalk.yellow.bold(interpolatedCommand)} in ${chalk.grey.bold(currentProjectDirectory)}`,
      );
    }

    try {
      return await this.runCommand(interpolatedCommand, currentProjectDirectory);
    } catch (error) {
      throw new CodxError('Error executing command', error);
    }
  }

  /**
   * Run a command
   * @param command The npm command to execute
   * @param cwd The working directory
   * @returns A promise that resolves when the command completes
   */
  protected async runCommand(command: string, cwd: string) {
    return new Promise((resolve, reject) => {
      const result = spawnSync(command, { shell: true, cwd }); // NOSONAR

      if (result.error) {
        reject(result.error);
      } else {
        resolve({
          code: result.status,
          output: result.output.toString(),
        });
      }
    });
  }
}
