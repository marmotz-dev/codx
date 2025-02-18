export type LogArgs = string[];

export const LOG_NAME = 'log';

export type LogAction = {
  [LOG_NAME]: LogArgs;
};
