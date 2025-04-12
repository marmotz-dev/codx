import { RecipeSchema } from '@/core/Recipe.schema';
import chalk from 'chalk';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { z } from 'zod';

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

const schema = z.toJSONSchema(RecipeSchema);

writeFileSync(resolve(process.cwd(), outputPath), JSON.stringify(schema, undefined, 2));

console.log(`${chalk.green.bold('✓️')} Recipe JSON schema has been written to ${chalk.yellow(outputPath)}`);
