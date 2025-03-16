import { ActionsData, ActionsDataSchema } from '@/actions/Actions.schema';
import { z, ZodType } from 'zod';

// Recursive definition for Step
export type Step = {
  name?: string;
  action: ActionsData;
  condition?: string;
  onSuccess?: Step[];
  onFailure?: Step[];
  finally?: Step[];
  workingDirectory?: string;
  variable?: string;
};

export const StepSchema: ZodType<Step> = z.lazy(() =>
  z.object({
    name: z.string().optional(),
    action: ActionsDataSchema,
    condition: z.string().optional(),
    onSuccess: z.array(StepSchema).optional(),
    onFailure: z.array(StepSchema).optional(),
    finally: z.array(StepSchema).optional(),
    workingDirectory: z.string().optional(),
    variable: z.string().optional(),
  }),
);

// Complete schema of a recipe
export const RecipeSchema = z.object({
  description: z.string(),
  author: z.string().optional(),
  steps: z.array(StepSchema),
});

export type Recipe = z.infer<typeof RecipeSchema>;
