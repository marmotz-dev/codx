// Base schemas
import { z } from 'zod';

export const MessageActionDataSchema = z
  .object({
    type: z.literal('message'),
    content: z.string(),
    style: z.enum(['default', 'header', 'info', 'success', 'warning', 'error']).optional().default('default'),
  })
  .describe('MessageActionDataSchema');

export type MessageActionData = z.infer<typeof MessageActionDataSchema>;
