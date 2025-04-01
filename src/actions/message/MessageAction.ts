import { BaseAction } from '@/actions/BaseAction';
import { MessageActionData } from '@/actions/message/MessageAction.schema';
import { CodxError } from '@/core/CodxError';
import { Context } from '@/core/Context';
import { Inject } from '@/di/InjectDecorator';
import { Logger } from '@/core/Logger';

/**
 * Action to display messages in the console
 */
export class MessageAction extends BaseAction {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject(Context) context: Context,
  ) {
    super(context);
  }

  /**
   * Executes the message action
   * @param {MessageActionData} actionData Action data
   */
  public async execute(actionData: MessageActionData) {
    const { content, style = 'default' } = actionData;

    if (!content) {
      throw new CodxError('Message action requires a content parameter');
    }

    const interpolatedContent = this.interpolate(content);

    this.logger.message(interpolatedContent, style);

    return {
      message: interpolatedContent,
      style,
    };
  }
}
