import { PromptAction } from '@/actions/prompt/PromptAction';
import {
  PromptActionCheckboxData,
  PromptActionConfirmData,
  PromptActionNumberData,
  PromptActionSelectData,
  PromptActionTextData,
} from '@/actions/prompt/PromptAction.schema';
import { CodxError } from '@/core/CodxError';
import { diContainer } from '@/di/Container';
import { MockCleaner, mockModule } from '@/testHelpers/mockModule';
import * as prompts from '@inquirer/prompts';
import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';

describe('PromptAction', () => {
  let promptAction: PromptAction;
  let mockInquirerCleaner: MockCleaner;

  beforeEach(async () => {
    diContainer.reset();
    promptAction = diContainer.get(PromptAction);

    mockInquirerCleaner = await mockModule('@inquirer/prompts', () => ({
      input: mock(),
      number: mock(),
      select: mock(),
      checkbox: mock(),
      confirm: mock(),
    }));

    spyOn(promptAction as any, 'interpolate').mockImplementation((text: string) => text);
  });

  afterEach(() => {
    mockInquirerCleaner();
  });

  describe('execute', () => {
    test('throws error when message is missing', async () => {
      const actionData = { type: 'prompt', promptType: 'text' } as any;

      expect(promptAction.execute(actionData)).rejects.toThrow(
        new CodxError('Prompt action requires a message parameter'),
      );
    });

    test('handles text prompt', async () => {
      (prompts.input as any).mockResolvedValue('input value');

      const actionData = {
        type: 'prompt',
        promptType: 'text',
        message: 'Enter text',
        defaultValue: 'default',
      } as PromptActionTextData;

      const result = await promptAction.execute(actionData);

      expect(prompts.input).toHaveBeenCalledWith({
        message: 'Enter text',
        default: 'default',
      });
      expect(result).toEqual({ answer: 'input value' });
    });

    test('handles number prompt with numeric default value', async () => {
      (prompts.number as any).mockResolvedValue(42);

      const actionData = {
        type: 'prompt',
        promptType: 'number',
        message: 'Enter number',
        defaultValue: 10,
      } as PromptActionNumberData;

      const result = await promptAction.execute(actionData);

      expect(prompts.number).toHaveBeenCalledWith({
        message: 'Enter number',
        default: 10,
      });
      expect(result).toEqual({ answer: 42 });
    });

    test('handles number prompt with string default value', async () => {
      (prompts.number as any).mockResolvedValue(42);

      const actionData = {
        type: 'prompt',
        promptType: 'number',
        message: 'Enter number',
        defaultValue: '10',
      } as PromptActionNumberData;

      const result = await promptAction.execute(actionData);

      expect(promptAction['interpolate']).toHaveBeenCalledWith('10');
      expect(prompts.number).toHaveBeenCalledWith({
        message: 'Enter number',
        default: 10,
      });
      expect(result).toEqual({ answer: 42 });
    });

    test('handles select prompt', async () => {
      (prompts.select as any).mockResolvedValue('option2');

      const actionData = {
        type: 'prompt',
        promptType: 'select',
        message: 'Select option',
        choices: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
        defaultValue: 'option1',
      } as PromptActionSelectData;

      const result = await promptAction.execute(actionData);

      expect(prompts.select).toHaveBeenCalledWith({
        message: 'Select option',
        choices: [
          { value: 'option1', name: 'Option 1' },
          { value: 'option2', name: 'Option 2' },
        ],
        default: 'option1',
      });
      expect(result).toEqual({ answer: 'option2' });
    });

    test('handles confirm prompt', async () => {
      (prompts.confirm as any).mockResolvedValue(true);

      const actionData = {
        type: 'prompt',
        promptType: 'confirm',
        message: 'Are you sure?',
        defaultValue: false,
      } as PromptActionConfirmData;

      const result = await promptAction.execute(actionData);

      expect(prompts.confirm).toHaveBeenCalledWith({
        message: 'Are you sure?',
        default: false,
      });
      expect(result).toEqual({ answer: true });
    });

    test('handles checkbox prompt', async () => {
      (prompts.checkbox as any).mockResolvedValue(['option1', 'option3']);

      const actionData = {
        type: 'prompt',
        promptType: 'checkbox',
        message: 'Select options',
        choices: {
          option1: 'Option 1',
          option2: 'Option 2',
          option3: 'Option 3',
        },
        defaultValues: ['option2'],
      } as PromptActionCheckboxData;

      const result = await promptAction.execute(actionData);

      expect(prompts.checkbox).toHaveBeenCalledWith({
        message: 'Select options',
        choices: [
          { value: 'option1', name: 'Option 1', checked: false },
          {
            value: 'option2',
            name: 'Option 2',
            checked: true,
          },
          { value: 'option3', name: 'Option 3', checked: false },
        ],
      });
      expect(result).toEqual({ answers: ['option1', 'option3'] });
    });
  });

  describe('promptText', () => {
    test('uses default value when provided', async () => {
      (prompts.input as any).mockResolvedValue('user input');

      const actionData = {
        type: 'prompt',
        promptType: 'text',
        message: 'Enter text',
        defaultValue: 'default text',
      } as PromptActionTextData;

      const result = await promptAction.execute(actionData);

      expect(prompts.input).toHaveBeenCalledWith({
        message: 'Enter text',
        default: 'default text',
      });
      expect(result).toEqual({ answer: 'user input' });
    });

    test('works without default value', async () => {
      (prompts.input as any).mockResolvedValue('user input');

      const actionData = {
        type: 'prompt',
        promptType: 'text',
        message: 'Enter text',
      } as PromptActionTextData;

      const result = await promptAction.execute(actionData);

      expect(prompts.input).toHaveBeenCalledWith({
        message: 'Enter text',
        default: undefined,
      });
      expect(result).toEqual({ answer: 'user input' });
    });
  });

  describe('promptNumber', () => {
    test('uses 0 as default when no default provided', async () => {
      (prompts.number as any).mockResolvedValue(42);

      const actionData = {
        type: 'prompt',
        promptType: 'number',
        message: 'Enter number',
      } as PromptActionNumberData;

      const result = await promptAction.execute(actionData);

      expect(prompts.number).toHaveBeenCalledWith({
        message: 'Enter number',
        default: 0,
      });
      expect(result).toEqual({ answer: 42 });
    });
  });

  describe('promptSelect', () => {
    test('uses empty string as default when no default provided', async () => {
      (prompts.select as any).mockResolvedValue('option1');

      const actionData = {
        type: 'prompt',
        promptType: 'select',
        message: 'Select option',
        choices: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
      } as PromptActionSelectData;

      const result = await promptAction.execute(actionData);

      expect(prompts.select).toHaveBeenCalledWith({
        message: 'Select option',
        choices: [
          { value: 'option1', name: 'Option 1' },
          { value: 'option2', name: 'Option 2' },
        ],
        default: '',
      });
      expect(result).toEqual({ answer: 'option1' });
    });
  });

  describe('promptCheckbox', () => {
    test('uses empty array as default when no defaults provided', async () => {
      (prompts.checkbox as any).mockResolvedValue(['option2']);

      const actionData = {
        type: 'prompt',
        promptType: 'checkbox',
        message: 'Select options',
        choices: {
          option1: 'Option 1',
          option2: 'Option 2',
        },
      } as PromptActionCheckboxData;

      const result = await promptAction.execute(actionData);

      expect(prompts.checkbox).toHaveBeenCalledWith({
        message: 'Select options',
        choices: [
          { value: 'option1', name: 'Option 1', checked: false },
          {
            value: 'option2',
            name: 'Option 2',
            checked: false,
          },
        ],
      });
      expect(result).toEqual({ answers: ['option2'] });
    });
  });
});
