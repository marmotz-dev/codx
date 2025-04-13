import { BaseAction } from '@/actions/BaseAction';
import { FailActionData } from '@/actions/fail/FailAction.schema';
import { ExplicitFailureCodxError } from '@/core/errors/ExplicitFailureCodxError';

/**
 * Action that deliberately fails with a custom error message
 */
export class FailAction extends BaseAction {
  /**
   * Executes the fail action
   * @param {FailActionData} actionData Data of action to execute
   * @throws {ExplicitFailureCodxError} Always throws an error with the specified message
   */
  public async execute(actionData: FailActionData): Promise<void> {
    const { message = 'Explicit failure triggered by fail action' } = actionData;

    throw new ExplicitFailureCodxError(message);
  }
}
