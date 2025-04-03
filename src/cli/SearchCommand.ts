import { BaseCommand } from '@/cli/BaseCommand';
import { CodxError } from '@/core/CodxError';
import { Logger } from '@/core/Logger';
import { diContainer } from '@/di/Container';
import chalk from 'chalk';
import ora from 'ora';

export interface SearchActionOptions {
  verbose: boolean;
}

type NpmPackagesResponse = {
  objects: Array<{
    package: {
      name: string;
      sanitized_name?: string;
      keywords?: string[];
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

    const spinner = ora({
      text: chalk.blue(`Searching recipes for "${searchTerm}"`),
      color: 'yellow',
    }).start();

    let searchResponse: NpmPackagesResponse;
    try {
      searchResponse = await this.searchRecipes(searchTerm);
    } finally {
      spinner.stop();
    }

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
      this.logger.message(chalk.green.bold(`${index + 1}. ${pkg.name}`));
      this.logger.message(`   ${pkg.description ?? 'No description'}`);
      this.logger.message(
        chalk.grey(
          `   ${chalk.bold('Version:')} ${pkg.version} | ${chalk.bold('Author:')} ${pkg.publisher?.username ?? 'Unknown'} | ${chalk.bold('Keywords:')} ${pkg.keywords?.join(', ') ?? 'None'}`,
        ),
      );
      this.logger.message(chalk.blue(`   Link: ${pkg.links?.npm ?? pkg.links?.homepage ?? ''}`));
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

    data.objects = data.objects.filter((pkg) => {
      const searchTerms = searchTerm.toLowerCase().split(' ');

      const name = pkg.package.name.toLowerCase();
      const description = pkg.package.description?.toLowerCase();
      const sanitizedName = pkg.package.sanitized_name?.toLowerCase();
      const keywords = pkg.package.keywords?.map((keyword) => keyword.toLowerCase());

      for (let term of searchTerms) {
        if (
          name.includes(term) ||
          description?.includes(term) ||
          sanitizedName?.includes(term) ||
          keywords?.includes(term)
        ) {
          return true;
        }
      }

      return false;
    });

    data.total = data.objects.length;

    return data;
  }
}
