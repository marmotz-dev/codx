import { IAction } from '@/actions/Action.interface';
import { actionRegistry, ActionRegistry } from '@/actions/ActionRegistry';
import { ActionsData } from '@/actions/Actions.schema';
import { UnknownActionCodxError } from '@/core/errors/UnknownActionCodxError';
import { diContainer } from '@/di/Container';

/**
 * Factory to create action instances from action data
 */
export class ActionFactory {
  constructor(private readonly registry: ActionRegistry = actionRegistry) {}

  /**
   * Creates an action instance from action data
   * @param {ActionsData} actionData The data defining the action
   * @returns An action instance if the type is recognized
   */
  public createAction(actionData: ActionsData): IAction {
    const actionType = actionData.type;

    if (this.registry[actionType] === undefined) {
      throw new UnknownActionCodxError(actionType);
    }

    return diContainer.get(this.registry[actionType]);
  }
}
