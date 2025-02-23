import { LoggerActions } from '@/actions/console/logger';

export const CONSOLE_NAMESPACE = 'console';

export const CONSOLE_CHECK_NAME = `${CONSOLE_NAMESPACE}.check`;
export const CONSOLE_CHECK_GROUP_NAME = `${CONSOLE_NAMESPACE}.checkGroup`;
export const CONSOLE_CHECK_GROUP_END_NAME = `${CONSOLE_NAMESPACE}.checkGroupEnd`;
export const CONSOLE_ERROR_NAME = `${CONSOLE_NAMESPACE}.error`;
export const CONSOLE_ERROR_GROUP_NAME = `${CONSOLE_NAMESPACE}.errorGroup`;
export const CONSOLE_ERROR_GROUP_END_NAME = `${CONSOLE_NAMESPACE}.errorGroupEnd`;
export const CONSOLE_INFO_NAME = `${CONSOLE_NAMESPACE}.info`;
export const CONSOLE_INFO_GROUP_NAME = `${CONSOLE_NAMESPACE}.infoGroup`;
export const CONSOLE_INFO_GROUP_END_NAME = `${CONSOLE_NAMESPACE}.infoGroupEnd`;
export const CONSOLE_SUCCESS_NAME = `${CONSOLE_NAMESPACE}.success`;
export const CONSOLE_SUCCESS_GROUP_NAME = `${CONSOLE_NAMESPACE}.successGroup`;
export const CONSOLE_SUCCESS_GROUP_END_NAME = `${CONSOLE_NAMESPACE}.successGroupEnd`;

export const ConsoleActions = {
  [CONSOLE_CHECK_NAME]: LoggerActions.check,
  [CONSOLE_CHECK_GROUP_NAME]: LoggerActions.checkGroup,
  [CONSOLE_CHECK_GROUP_END_NAME]: LoggerActions.checkGroupEnd,
  [CONSOLE_ERROR_NAME]: LoggerActions.error,
  [CONSOLE_ERROR_GROUP_NAME]: LoggerActions.errorGroup,
  [CONSOLE_ERROR_GROUP_END_NAME]: LoggerActions.errorGroupEnd,
  [CONSOLE_INFO_NAME]: LoggerActions.info,
  [CONSOLE_INFO_GROUP_NAME]: LoggerActions.infoGroup,
  [CONSOLE_INFO_GROUP_END_NAME]: LoggerActions.infoGroupEnd,
  [CONSOLE_SUCCESS_NAME]: LoggerActions.success,
  [CONSOLE_SUCCESS_GROUP_NAME]: LoggerActions.successGroup,
  [CONSOLE_SUCCESS_GROUP_END_NAME]: LoggerActions.successGroupEnd,
} as const;
