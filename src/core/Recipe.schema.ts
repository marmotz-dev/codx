import { ActionsData, ActionsDataSchema } from '@/actions/Actions.schema';
import { z, ZodType } from 'zod';

// Recursive definition for Step
export type Step = {
  action: ActionsData;
  name?: string;
  condition?: string;
  onSuccess?: Step[];
  onFailure?: Step[];
  finally?: Step[];
  workingDirectory?: string;
  variable?: string;
};

export const StepSchema: ZodType<Step> = z.lazy(() =>
  z.object({
    action: ActionsDataSchema,
    name: z.string().optional(),
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
