import { BaseCommand } from '@/cli/BaseCommand';
import { diContainer } from '@/di/Container';
import { Logger } from '@/core/Logger';
import { PackageManagerDetector, PackageManagers } from '@/core/PackageManagerDetector';
import { RecipeLoader } from '@/core/RecipeLoader';
import { RecipeRunner } from '@/core/RecipeRunner';

export interface RunActionOptions {
  pm?: PackageManagers;
  projectDir: string;
  verbose: boolean;
}

export class RunCommand extends BaseCommand {
  async doExecute(recipePath: string, options: RunActionOptions): Promise<void> {
    options.verbose = options.verbose ?? false;

    if (options.verbose) {
      const logger = diContainer.get(Logger);
      logger.setVerbose();
    }

    const packageManagerDetector = diContainer.get(PackageManagerDetector);
    const recipeLoader = diContainer.get(RecipeLoader);
    const recipeRunner = diContainer.get(RecipeRunner);

    packageManagerDetector.detect(options.pm);

    const recipe = await recipeLoader.loadByNameOrPath(recipePath);
    await recipeRunner.run(recipe, options.projectDir);
  }
}
