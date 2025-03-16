import { BaseCommand } from '@/cli/BaseCommand';
import { CodxError } from '@/core/CodxError';
import { Logger } from '@/core/Logger';
import { diContainer } from '@/di/Container';
import chalk from 'chalk';

export interface SearchActionOptions {
  verbose: boolean;
}

type NpmPackagesResponse = {
  objects: Array<{
    package: {
      name: string;
      description?: string;
      version: string;
      publisher?: {
        username?: string;
      };
      links?: {
        npm?: string;
        homepage?: string;
      };
    };
  }>;
  total: number;
};

export class SearchCommand extends BaseCommand {
  async doExecute(searchTerm: string, options: SearchActionOptions): Promise<void> {
    options.verbose = options.verbose ?? false;

    if (options.verbose) {
      const logger = diContainer.get(Logger);
      logger.setVerbose();
    }

    const searchResponse = await this.searchRecipes(searchTerm);

    this.displayRecipes(searchTerm, searchResponse);
  }

  /**
   * Display results
   * @param searchTerm Search term to find related packages
   * @param searchResponse Search data
   */
  private displayRecipes(searchTerm: string, searchResponse: NpmPackagesResponse) {
    this.logger.message(chalk.blue(`\nSearch results for "${searchTerm}":\n`));

    searchResponse.objects.forEach(({ package: pkg }, index: number) => {
      this.logger.message(chalk.green(`${index + 1}. ${pkg.name}`));
      this.logger.message(`   ${pkg.description ?? 'No description'}`);
      this.logger.message(`   Version: ${pkg.version} | Author: ${pkg.publisher?.username ?? 'Unknown'}`);
      this.logger.message(`   Link: ${pkg.links?.npm ?? pkg.links?.homepage ?? ''}`);
      this.logger.message('');
    });

    this.logger.message(chalk.blue(`Found ${searchResponse.total} package${searchResponse.total > 1 ? 's' : ''}.`));
  }

  /**
   * Search for npm packages related to codx recipes
   * @param searchTerm Search term to find related packages
   * @returns Promise<NpmPackagesResponse>
   */
  private async searchRecipes(searchTerm: string) {
    const query = `${searchTerm} keyword:codx-recipe`;
    const url = `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=100`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new CodxError(`Failed to search npm packages: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as NpmPackagesResponse;

    if (data.objects.length === 0) {
      throw new CodxError(`No packages found matching "${searchTerm}"`);
    }

    return data;
  }
}
