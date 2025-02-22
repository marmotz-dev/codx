import { CONSOLE_LOG_NAME } from '@/actions/console/log.const';

export type ConsoleLogArgs = string[];

export type ConsoleLogAction = {
  [CONSOLE_LOG_NAME]: ConsoleLogArgs;
};
