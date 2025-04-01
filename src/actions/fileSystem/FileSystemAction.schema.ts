import { z } from 'zod';

export const FileSystemActionCreateDataSchema = z
  .object({
    type: z.literal('fileSystem'),
    operation: z.literal('create'),
    path: z.string(),
    content: z.string().optional(),
    overwrite: z.boolean().optional().default(false),
  })
  .describe('FileSystemActionCreateDataSchema');

export type FileSystemActionCreateData = z.infer<typeof FileSystemActionCreateDataSchema>;

export const FileSystemActionDeleteDataSchema = z
  .object({
    type: z.literal('fileSystem'),
    operation: z.literal('delete'),
    path: z.string(),
  })
  .describe('FileSystemActionDeleteDataSchema');

export type FileSystemActionDeleteData = z.infer<typeof FileSystemActionDeleteDataSchema>;

export const FileSystemActionExistsDataSchema = z
  .object({
    type: z.literal('fileSystem'),
    operation: z.literal('exists'),
    path: z.string(),
  })
  .describe('FileSystemActionExistsDataSchema');

export type FileSystemActionExistsData = z.infer<typeof FileSystemActionExistsDataSchema>;

export const FileSystemActionMkdirDataSchema = z
  .object({
    type: z.literal('fileSystem'),
    operation: z.literal('mkdir'),
    path: z.string(),
  })
  .describe('FileSystemActionMkdirDataSchema');

export type FileSystemActionMkdirData = z.infer<typeof FileSystemActionMkdirDataSchema>;

export const FileSystemActionCopyDataSchema = z
  .object({
    type: z.literal('fileSystem'),
    operation: z.literal('copy'),
    source: z.string(),
    destination: z.string(),
    overwrite: z.boolean().optional().default(false),
  })
  .describe('FileSystemActionCopyDataSchema');

export type FileSystemActionCopyData = z.infer<typeof FileSystemActionCopyDataSchema>;

export const FileSystemActionMoveDataSchema = z
  .object({
    type: z.literal('fileSystem'),
    operation: z.literal('move'),
    source: z.string(),
    destination: z.string(),
    overwrite: z.boolean().optional().default(false),
  })
  .describe('FileSystemActionMoveDataSchema');

export type FileSystemActionMoveData = z.infer<typeof FileSystemActionMoveDataSchema>;

export const FileSystemActionDataSchema = z
  .union([
    FileSystemActionCreateDataSchema,
    FileSystemActionDeleteDataSchema,
    FileSystemActionExistsDataSchema,
    FileSystemActionMkdirDataSchema,
    FileSystemActionCopyDataSchema,
    FileSystemActionMoveDataSchema,
  ])
  .describe('FileSystemActionDataSchema');

export type FileSystemActionData = z.infer<typeof FileSystemActionDataSchema>;
