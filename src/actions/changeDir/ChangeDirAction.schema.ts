import { z } from 'zod';

export const ChangeDirActionDataSchema = z
  .object({
    type: z.literal('changeDir'),
    path: z.string(),
  })
  .describe('ChangeDirActionDataSchema');

export type ChangeDirActionData = z.infer<typeof ChangeDirActionDataSchema>;
