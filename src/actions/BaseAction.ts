import { IAction } from '@/actions/Action.interface';
import { ActionsData } from '@/actions/Actions.schema';
import { Context } from '@/core/Context';
import { Logger } from '@/core/Logger';
import { Inject } from '@/di/InjectDecorator';

/**
 * Abstract base class for all actions
 */
export abstract class BaseAction implements IAction {
  /**
   * Constructor with current context
   * @param {Context} context The execution context
   * @param {Logger} logger
   */
  constructor(
    @Inject(Context) protected readonly context: Context,
    @Inject(Logger) protected readonly logger: Logger,
  ) {}

  /**
   * Executes the action and handles success, failure, and finally steps
   * @param {ActionsData} actionData Data of action to execute
   */
  public abstract execute(actionData: ActionsData): Promise<any>;

  /**
   * Interpolates variable values in a string
   * @param value The string to interpret
   * @returns The string with variables replaced
   */
  protected interpolate(value: string): string {
    return this.context.store.interpolate(value);
  }
}
