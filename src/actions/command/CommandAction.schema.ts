import { z } from 'zod';

export const CommandActionDataSchema = z
  .object({
    type: z.literal('command'),
    command: z.string(),
  })
  .describe('CommandActionDataSchema');

export type CommandActionData = z.infer<typeof CommandActionDataSchema>;
