import { LoggerService } from '@/services/logger';
import { Step, StepContext } from '@/types/step.type';
import { LogArgs } from '@/types/steps/log.type';

export const log: Step<LogArgs> = async ({ args: texts }: StepContext<LogArgs>): Promise<void> => {
  if (!texts || texts.length === 0) {
    throw new Error('A text list is required for the "log" step');
  }

  for (const text of texts) {
    LoggerService.getInstance().info(text);
  }
};
