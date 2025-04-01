import { z } from 'zod';

export const PackageActionInstallDataSchema = z
  .object({
    type: z.literal('package'),
    operation: z.literal('install'),
    packages: z.array(z.string()),
    dev: z.boolean().optional().default(false),
  })
  .describe('PackageActionInstallDataSchema');

export type PackageActionInstallData = z.infer<typeof PackageActionInstallDataSchema>;

export const PackageActionRemoveDataSchema = z
  .object({
    type: z.literal('package'),
    operation: z.literal('remove'),
    packages: z.array(z.string()),
  })
  .describe('PackageActionRemoveDataSchema');

export type PackageActionRemoveData = z.infer<typeof PackageActionRemoveDataSchema>;

export const PackageActionUpdateDataSchema = z
  .object({
    type: z.literal('package'),
    operation: z.literal('update'),
    packages: z.array(z.string()),
  })
  .describe('PackageActionUpdateDataSchema');

export type PackageActionUpdateData = z.infer<typeof PackageActionUpdateDataSchema>;

export const PackageActionCheckDataSchema = z
  .object({
    type: z.literal('package'),
    operation: z.literal('check'),
    packages: z.array(
      z.object({
        package: z.string(),
        minVersion: z.string().optional(),
        maxVersion: z.string().optional(),
      }),
    ),
  })
  .describe('PackageActionCheckDataSchema');

export type PackageActionCheckData = z.infer<typeof PackageActionCheckDataSchema>;

export const PackageActionRunDataSchema = z
  .object({
    type: z.literal('package'),
    operation: z.literal('run'),
    package: z.string(),
    options: z.string().optional(),
  })
  .describe('PackageActionRunDataSchema');

export type PackageActionRunData = z.infer<typeof PackageActionRunDataSchema>;

export const PackageActionDataSchema = z
  .union([
    PackageActionInstallDataSchema,
    PackageActionRemoveDataSchema,
    PackageActionUpdateDataSchema,
    PackageActionCheckDataSchema,
    PackageActionRunDataSchema,
  ])
  .describe('PackageActionDataSchema');

export type PackageActionData = z.infer<typeof PackageActionDataSchema>;
