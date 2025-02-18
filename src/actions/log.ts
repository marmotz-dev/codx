import { LoggerService } from '@/services/logger';
import { Action, ActionContext } from '@/types/action.type';
import { LogArgs } from '@/types/actions/log.type';

export const log: Action<LogArgs> = async ({ args: texts }: ActionContext<LogArgs>): Promise<void> => {
  if (!texts || texts.length === 0) {
    throw new Error('A text list is required for the "log" action');
  }

  for (const text of texts) {
    LoggerService.getInstance().info(text);
  }
};
