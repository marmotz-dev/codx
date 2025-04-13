import { BaseAction } from '@/actions/BaseAction';
import { MessageActionData } from '@/actions/message/MessageAction.schema';
import { MissingContentCodxError } from '@/core/errors/MissingContentCodxError';

/**
 * Action to display messages in the console
 */
export class MessageAction extends BaseAction {
  /**
   * Executes the message action
   * @param {MessageActionData} actionData Action data
   */
  public async execute(actionData: MessageActionData) {
    const { content, style = 'default' } = actionData;

    if (!content) {
      throw new MissingContentCodxError();
    }

    const interpolatedContent = this.interpolate(content);

    this.logger.message(interpolatedContent, style);

    return {
      message: interpolatedContent,
      style,
    };
  }
}
