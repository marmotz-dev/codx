import { ActionsDataSchema } from '@/actions/Actions.schema';
import { RecipeSchema, StepSchema } from '@/core/Recipe.schema';
import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { ZodType, ZodUnion } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Output path
let outputPath = process.argv[2];

if (!outputPath?.endsWith('.json')) {
  console.error('Please provide the output path as the first argument ending with a json file');
  process.exit(1);
}

outputPath = resolve(process.cwd(), outputPath);

const parentPath = dirname(outputPath);
if (!existsSync(parentPath)) {
  mkdirSync(parentPath, { recursive: true });
}

// Load definitions
const definitions: Record<string, ZodType> = { StepSchema };

function loadDefinitions(schema: ZodUnion<any>) {
  schema.options.forEach((childSchema: ZodType, index: number) => {
    if (childSchema instanceof ZodUnion) {
      loadDefinitions(childSchema);
    } else if (childSchema.description) {
      definitions[childSchema.description] = childSchema;
    } else {
      console.warn(`Missing description for ${index}th child of ${schema.description}`);
    }
  });
}

loadDefinitions(ActionsDataSchema);

// Generate schema
const schema = zodToJsonSchema(RecipeSchema, {
  definitions,
});

writeFileSync(resolve(process.cwd(), outputPath), JSON.stringify(schema, undefined, 2));

console.log(`${chalk.green.bold('✓️')} Recipe JSON schema has been written to ${chalk.yellow(outputPath)}`);
