import { Action } from '@/actions/action.type';
import { ConsoleLogArgs, ConsoleLogGroupArgs } from '@/actions/console/console.type';
import { loggerService } from '@/services/logger';

export class LoggerActions {
  static check: Action<ConsoleLogArgs> = async ({ args: texts }) => {
    texts = LoggerActions.validateTexts(texts, 'check');
    for (const text of texts) {
      loggerService.check(text);
    }
  };

  static checkGroup: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text, 'checkGroup');
    loggerService.checkGroup(text);
  };

  static checkGroupEnd: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text, 'checkGroupEnd');
    loggerService.checkGroupEnd(text);
  };

  static error: Action<ConsoleLogArgs> = async ({ args: texts }) => {
    texts = LoggerActions.validateTexts(texts, 'error');
    for (const text of texts) {
      loggerService.error(text);
    }
  };

  static errorGroup: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text, 'errorGroup');
    loggerService.errorGroup(text);
  };

  static errorGroupEnd: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text, 'errorGroupEnd');
    loggerService.errorGroupEnd(text);
  };

  static info: Action<ConsoleLogArgs> = async ({ args: texts }) => {
    texts = LoggerActions.validateTexts(texts, 'info');
    for (const text of texts) {
      loggerService.info(text);
    }
  };

  static infoGroup: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text, 'infoGroup');
    loggerService.infoGroup(text);
  };

  static infoGroupEnd: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text, 'infoGroupEnd');
    loggerService.infoGroupEnd(text);
  };

  static success: Action<ConsoleLogArgs> = async ({ args: texts }) => {
    texts = LoggerActions.validateTexts(texts, 'success');
    for (const text of texts) {
      loggerService.success(text);
    }
  };

  static successGroup: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text, 'successGroup');
    loggerService.successGroup(text);
  };

  static successGroupEnd: Action<ConsoleLogGroupArgs> = async ({ args: text }) => {
    LoggerActions.validateText(text, 'successGroupEnd');
    loggerService.successGroupEnd(text);
  };

  private static validateText(text: string, actionName: string): void {
    if (!text) {
      throw new Error(`A text is required for ${actionName} action`);
    }

    if (Array.isArray(text)) {
      throw new Error(`A single text is required for ${actionName} action`);
    }
  }

  private static validateTexts(texts: string[], actionName: string): string[] {
    texts = Array.isArray(texts) ? texts : [texts];

    if (!texts || texts.length === 0) {
      throw new Error(`A text list is required for ${actionName} action`);
    }

    return texts;
  }
}
