#!/usr/bin/env node

import { loggerService } from '@/services/logger';
import { packageManagerService, PackageManagerType } from '@/services/packageManager';
import { recipeRunner } from '@/services/recipeRunner';
import { Command } from 'commander';
import { description, name, version } from '../package.json';

const program = new Command();
const logger = loggerService;

program
  .name(name)
  .description(description)
  .version(version)
  .option('--pm <package-manager>', 'Package manager to use (npm, pnpm, yarn, bun)');

program
  .command('recipe')
  .description('Execute a recipe')
  .argument('<name-or-path>', 'Recipe name / Path to local recipe file')
  .action(async (recipeNameOrPath) => {
    try {
      logger.infoGroup(name + ' v' + version);

      const options = program.opts();

      if (options.pm) {
        const validPMs: PackageManagerType[] = ['npm', 'pnpm', 'yarn', 'bun'];
        if (!validPMs.includes(options.pm)) {
          throw new Error('Invalid package manager. Use npm, pnpm, yarn or bun');
        }

        packageManagerService.setPackageManager(options.pm as PackageManagerType);
      } else {
        await packageManagerService.loadDefaultPackageManager();
      }

      await recipeRunner.run(recipeNameOrPath);
      logger.successGroupEnd('Recipe executed successfully');
    } catch (error) {
      logger.errorGroupEnd((error as Error).message);
      process.exit(1);
    }
  });

program.parse();
