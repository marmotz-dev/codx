import { Action } from '@/actions/action.type';
import { ConsoleLogArgs, ConsoleLogGroupArgs } from '@/actions/console/console.type';
import { loggerService } from '@/services/logger';

export class LoggerActions {
  static check: Action<ConsoleLogArgs> = async ({ args: texts }) => {
    LoggerActions.validateTexts(texts);
    for (const text of texts) {
      loggerService.check(text);
    }
  };

  static checkGroup: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text);
    loggerService.checkGroup(text);
  };

  static checkGroupEnd: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text);
    loggerService.checkGroupEnd(text);
  };

  static error: Action<ConsoleLogArgs> = async ({ args: texts }) => {
    LoggerActions.validateTexts(texts);
    for (const text of texts) {
      loggerService.error(text);
    }
  };

  static errorGroup: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text);
    loggerService.errorGroup(text);
  };

  static errorGroupEnd: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text);
    loggerService.errorGroupEnd(text);
  };

  static info: Action<ConsoleLogArgs> = async ({ args: texts }) => {
    LoggerActions.validateTexts(texts);
    for (const text of texts) {
      loggerService.info(text);
    }
  };

  static infoGroup: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text);
    loggerService.infoGroup(text);
  };

  static infoGroupEnd: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text);
    loggerService.infoGroupEnd(text);
  };

  static success: Action<ConsoleLogArgs> = async ({ args: texts }) => {
    LoggerActions.validateTexts(texts);
    for (const text of texts) {
      loggerService.success(text);
    }
  };

  static successGroup: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text);
    loggerService.successGroup(text);
  };

  static successGroupEnd: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text);
    loggerService.successGroupEnd(text);
  };

  private static validateText(text: string): void {
    if (!text) {
      throw new Error('A text is required for logger actions');
    }
  }

  private static validateTexts(texts: string[]): void {
    if (!texts || texts.length === 0) {
      throw new Error('A text list is required for logger actions');
    }
  }
}
