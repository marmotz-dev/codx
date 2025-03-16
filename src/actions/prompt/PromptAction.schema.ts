import { z } from 'zod';

export const PromptActionTextDataSchema = z
  .object({
    type: z.literal('prompt'),
    promptType: z.literal('text'),
    message: z.string(),
    defaultValue: z.string().optional(),
  })
  .describe('PromptActionTextDataSchema');

export type PromptActionTextData = z.infer<typeof PromptActionTextDataSchema>;

export const PromptActionNumberDataSchema = z
  .object({
    type: z.literal('prompt'),
    promptType: z.literal('number'),
    message: z.string(),
    defaultValue: z.union([z.number(), z.string()]).optional(),
  })
  .describe('PromptActionNumberDataSchema');

export type PromptActionNumberData = z.infer<typeof PromptActionNumberDataSchema>;

export const PromptActionSelectDataSchema = z
  .object({
    type: z.literal('prompt'),
    promptType: z.literal('select'),
    message: z.string(),
    choices: z.record(z.string(), z.string()),
    defaultValue: z.string().optional(),
  })
  .describe('PromptActionSelectDataSchema');

export type PromptActionSelectData = z.infer<typeof PromptActionSelectDataSchema>;

export const PromptActionCheckboxDataSchema = z
  .object({
    type: z.literal('prompt'),
    promptType: z.literal('checkbox'),
    message: z.string(),
    choices: z.record(z.string(), z.string()),
    defaultValues: z.array(z.string()).optional(),
  })
  .describe('PromptActionCheckboxDataSchema');

export type PromptActionCheckboxData = z.infer<typeof PromptActionCheckboxDataSchema>;

export const PromptActionConfirmDataSchema = z
  .object({
    type: z.literal('prompt'),
    promptType: z.literal('confirm'),
    message: z.string(),
    defaultValue: z.boolean().optional().default(false),
  })
  .describe('PromptActionConfirmDataSchema');

export type PromptActionConfirmData = z.infer<typeof PromptActionConfirmDataSchema>;

export const PromptActionDataSchema = z
  .union([
    PromptActionTextDataSchema,
    PromptActionNumberDataSchema,
    PromptActionSelectDataSchema,
    PromptActionConfirmDataSchema,
    PromptActionCheckboxDataSchema,
  ])
  .describe('PromptActionDataSchema');

export type PromptActionData = z.infer<typeof PromptActionDataSchema>;
