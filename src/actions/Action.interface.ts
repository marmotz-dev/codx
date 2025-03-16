import { ActionsData } from '@/actions/Actions.schema';

/**
 * Base interface for all actions
 */
export interface IAction {
  /**
   * Executes the action
   * @param {ActionsData} actionData Data of action to execute
   */
  execute(actionData: ActionsData): Promise<any>;
}
