import { BaseAction } from '@/actions/BaseAction';
import {
  PromptActionCheckboxData,
  PromptActionConfirmData,
  PromptActionData,
  PromptActionNumberData,
  PromptActionSelectData,
  PromptActionTextData,
} from '@/actions/prompt/PromptAction.schema';
import { CodxError } from '@/core/CodxError';
import { checkbox, confirm, input, number, select } from '@inquirer/prompts';

/**
 * Action to ask for user input
 */
export class PromptAction extends BaseAction {
  /**
   * Executes the prompt action
   * @param {PromptActionData} actionData Action data
   * @returns The user input
   */
  public async execute(actionData: PromptActionData) {
    const { message, promptType } = actionData;

    if (!message) {
      throw new CodxError('Prompt action requires a message parameter');
    }

    let userInput: any;

    switch (promptType) {
      case 'checkbox':
        userInput = await this.promptCheckbox(actionData);
        break;

      case 'confirm':
        userInput = await this.promptConfirm(actionData);
        break;

      case 'number':
        userInput = await this.promptNumber(actionData);
        break;

      case 'select':
        userInput = await this.promptSelect(actionData);
        break;

      case 'text':
        userInput = await this.promptText(actionData);
        break;
    }

    return userInput;
  }

  /**
   * Prompt choice data from the user
   * @param {PromptActionCheckboxData} actionData Action data
   * @returns A promise that resolves to the user's input
   */
  private async promptCheckbox(actionData: PromptActionCheckboxData) {
    const { message, choices, defaultValues = [] } = actionData;

    const interpolatedMessage = this.interpolate(message);

    const answers = await checkbox({
      message: interpolatedMessage,
      choices: Object.entries(choices).map(([value, name]) => ({
        value,
        name,
        checked: defaultValues.includes(value),
      })),
    });

    return {
      answers,
    };
  }

  /**
   * Prompt confirm data from the user
   * @param {PromptActionConfirmData} actionData Action data
   * @returns A promise that resolves to the user's input
   */
  private async promptConfirm(actionData: PromptActionConfirmData) {
    const { message, defaultValue } = actionData;

    const interpolatedMessage = this.interpolate(message);

    const answer = await confirm({
      message: interpolatedMessage,
      default: defaultValue,
    });

    return {
      answer,
    };
  }

  /**
   * Prompt number data from the user
   * @param {PromptActionNumberData} actionData Action data
   * @returns A promise that resolves to the user's input
   */
  private async promptNumber(actionData: PromptActionNumberData) {
    const { message, defaultValue } = actionData;

    const interpolatedMessage = this.interpolate(message);

    let interpolatedDefaultValue;
    if (typeof defaultValue === 'string') {
      interpolatedDefaultValue = this.interpolate(defaultValue);
    } else {
      interpolatedDefaultValue = defaultValue ?? 0;
    }

    const answer = await number({
      message: interpolatedMessage,
      default: +interpolatedDefaultValue,
    });

    return {
      answer,
    };
  }

  /**
   * Prompt choice data from the user
   * @param {PromptActionSelectData} actionData Action data
   * @returns A promise that resolves to the user's input
   */
  private async promptSelect(actionData: PromptActionSelectData) {
    const { message, choices, defaultValue = '' } = actionData;

    const interpolatedMessage = this.interpolate(message);

    const answer = await select({
      message: interpolatedMessage,
      choices: Object.entries(choices).map(([value, name]) => ({
        value,
        name,
      })),
      default: defaultValue,
    });

    return {
      answer,
    };
  }

  /**
   * Prompt text data from the user
   * @param {PromptActionTextData} actionData Action data
   * @returns A promise that resolves to the user's input
   */
  private async promptText(actionData: PromptActionTextData) {
    const { message, defaultValue } = actionData;

    const interpolatedMessage = this.interpolate(message);
    const interpolatedDefaultValue = defaultValue ? this.interpolate(defaultValue) : undefined;

    const answer = await input({
      message: interpolatedMessage,
      default: interpolatedDefaultValue,
    });

    return {
      answer,
    };
  }
}
