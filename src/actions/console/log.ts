import { Action } from '@/actions/action.type';
import { ConsoleLogArgs } from '@/actions/console/log.type';
import { LoggerService } from '@/services/logger';

export const consoleLogAction: Action<ConsoleLogArgs> = async ({ args: texts }) => {
  if (!texts || texts.length === 0) {
    throw new Error('A text list is required for the "log" action');
  }

  for (const text of texts) {
    LoggerService.getInstance().info(text);
  }
};
