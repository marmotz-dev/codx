export type LogArgs = string[];

export const LOG_NAME = 'log';

export type LogStep = {
  [LOG_NAME]: LogArgs;
};
