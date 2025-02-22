import {
  CONSOLE_CHECK_GROUP_END_NAME,
  CONSOLE_CHECK_GROUP_NAME,
  CONSOLE_CHECK_NAME,
  CONSOLE_ERROR_GROUP_END_NAME,
  CONSOLE_ERROR_GROUP_NAME,
  CONSOLE_ERROR_NAME,
  CONSOLE_INFO_GROUP_END_NAME,
  CONSOLE_INFO_GROUP_NAME,
  CONSOLE_INFO_NAME,
  CONSOLE_SUCCESS_GROUP_END_NAME,
  CONSOLE_SUCCESS_GROUP_NAME,
  CONSOLE_SUCCESS_NAME,
} from '@/actions/console/console.const';

export type ConsoleLogArgs = string[];
export type ConsoleLogGroupArgs = string;

export type ConsoleCheckAction = {
  [CONSOLE_CHECK_NAME]: ConsoleLogArgs;
};
export type ConsoleCheckGroupAction = {
  [CONSOLE_CHECK_GROUP_NAME]: ConsoleLogGroupArgs;
};
export type ConsoleCheckGroupEndAction = {
  [CONSOLE_CHECK_GROUP_END_NAME]: ConsoleLogGroupArgs;
};
export type ConsoleErrorAction = {
  [CONSOLE_ERROR_NAME]: ConsoleLogArgs;
};
export type ConsoleErrorGroupAction = {
  [CONSOLE_ERROR_GROUP_NAME]: ConsoleLogGroupArgs;
};
export type ConsoleErrorGroupEndAction = {
  [CONSOLE_ERROR_GROUP_END_NAME]: ConsoleLogGroupArgs;
};
export type ConsoleInfoAction = {
  [CONSOLE_INFO_NAME]: ConsoleLogArgs;
};
export type ConsoleInfoGroupAction = {
  [CONSOLE_INFO_GROUP_NAME]: ConsoleLogGroupArgs;
};
export type ConsoleInfoGroupEndAction = {
  [CONSOLE_INFO_GROUP_END_NAME]: ConsoleLogGroupArgs;
};
export type ConsoleSuccessAction = {
  [CONSOLE_SUCCESS_NAME]: ConsoleLogArgs;
};
export type ConsoleSuccessGroupAction = {
  [CONSOLE_SUCCESS_GROUP_NAME]: ConsoleLogGroupArgs;
};
export type ConsoleSuccessGroupEndAction = {
  [CONSOLE_SUCCESS_GROUP_END_NAME]: ConsoleLogGroupArgs;
};
