import { z } from 'zod';

export const FailActionDataSchema = z
  .object({
    type: z.literal('fail'),
    message: z.string().optional(),
  })
  .describe('FailActionDataSchema');

export type FailActionData = z.infer<typeof FailActionDataSchema>;
