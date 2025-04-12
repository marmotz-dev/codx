import { z } from 'zod';

// append
export const FileManipulationActionAppendDataSchema = z
  .object({
    type: z.literal('fileManipulation'),
    operation: z.literal('append'),
    path: z.string(),
    content: z.string(),
  })
  .describe('FileManipulationActionAppendDataSchema');

export type FileManipulationActionAppendData = z.infer<typeof FileManipulationActionAppendDataSchema>;

// create
export const FileManipulationActionCreateDataSchema = z
  .object({
    type: z.literal('fileManipulation'),
    operation: z.literal('create'),
    path: z.string(),
    content: z.string().optional(),
    overwrite: z.boolean().optional().default(false),
  })
  .describe('FileManipulationActionCreateDataSchema');

export type FileManipulationActionCreateData = z.infer<typeof FileManipulationActionCreateDataSchema>;

// prepend
export const FileManipulationActionPrependDataSchema = z
  .object({
    type: z.literal('fileManipulation'),
    operation: z.literal('prepend'),
    path: z.string(),
    content: z.string(),
  })
  .describe('FileManipulationActionPrependDataSchema');

export type FileManipulationActionPrependData = z.infer<typeof FileManipulationActionPrependDataSchema>;

// update
export const FileManipulationActionUpdateDataSchema = z
  .object({
    type: z.literal('fileManipulation'),
    operation: z.literal('update'),
    path: z.string(),
    pattern: z.string(),
    content: z.string(),
  })
  .describe('FileManipulationActionUpdateDataSchema');

export type FileManipulationActionUpdateData = z.infer<typeof FileManipulationActionUpdateDataSchema>;

export const FileManipulationActionDataSchema = z
  .union([
    FileManipulationActionAppendDataSchema,
    FileManipulationActionCreateDataSchema,
    FileManipulationActionPrependDataSchema,
    FileManipulationActionUpdateDataSchema,
  ])
  .describe('FileManipulationActionDataSchema');

export type FileManipulationActionData = z.infer<typeof FileManipulationActionDataSchema>;
