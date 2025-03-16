import { BaseAction } from '@/actions/BaseAction';
import { ChangeDirActionData } from '@/actions/changeDir/ChangeDirAction.schema';
import { CodxError } from '@/core/CodxError';

/**
 * Action to change the working directory
 */
export class ChangeDirAction extends BaseAction {
  /**
   * Executes the directory change action
   * @param {ChangeDirActionData} actionData Action data
   */
  public async execute(actionData: ChangeDirActionData) {
    const { path } = actionData;

    if (!path) {
      throw new CodxError('Directory path is required for the changeDir action');
    }

    const interpolatedPath = this.interpolate(path);

    try {
      this.context.projectDirectory.change(interpolatedPath);
      this.logger.info(`Current working directory: ${this.context.projectDirectory.get()}`);
    } catch (error) {
      throw new CodxError('Error changing directory', error);
    }
  }
}
