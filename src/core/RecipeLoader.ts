import { CodxError } from '@/core/CodxError';
import { Logger } from '@/core/Logger.js';
import { Recipe, RecipeSchema } from '@/core/Recipe.schema';
import { RecipeDirectory } from '@/core/RecipeDirectory';
import { Inject } from '@/di/InjectDecorator';
import chalk from 'chalk';
import { mkdir, readFile } from 'fs/promises';
import { load } from 'js-yaml';
import { createWriteStream, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { extract } from 'tar';
import { z } from 'zod';

export class RecipeLoader {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject(RecipeDirectory) private readonly recipeDirectory: RecipeDirectory,
  ) {}

  async loadByNameOrPath(nameOrPath: string): Promise<Recipe> {
    let recipePath: string;
    let recipeDir: string;

    const titleLength = 24;

    if (this.isPath(nameOrPath)) {
      recipePath = this.resolveRecipePath(nameOrPath);

      if (recipePath.endsWith('.yml') || recipePath.endsWith('.yaml')) {
        recipeDir = dirname(recipePath);
      } else {
        recipeDir = recipePath;
        recipePath = join(recipeDir, 'recipe.yml');
      }
    } else {
      const { name, version } = this.parsePackageVersion(nameOrPath);
      const packageName = this.getPackageName(name);
      this.logger.message(`${'Recipe package'.padEnd(titleLength, '.')} : ${chalk.gray(packageName)}`);

      recipeDir = await this.downloadAndExtractPackage(packageName, version);
      recipePath = join(recipeDir, 'recipe.yml');
    }

    this.logger.message(`${'Recipe file'.padEnd(titleLength, '.')} : ${chalk.gray(recipePath)}`);

    if (!existsSync(recipePath)) {
      throw new CodxError(`Recipe file not found: ${recipePath}`);
    }

    this.recipeDirectory.init(recipeDir);

    return this.loadRecipe(recipePath);
  }

  /**
   * Downloads and extracts a package from npm
   * @param packageName Package name
   * @param version Package version
   * @returns Path to the extracted package
   */
  private async downloadAndExtractPackage(packageName: string, version: string): Promise<string> {
    // Create a temporary directory for the package
    const tempDir = mkdtempSync(join(tmpdir(), `${packageName}-${version}-`));

    // Ensure the directory exists
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Get the tarball URL from npm
    const registryUrl = `https://registry.npmjs.org/${packageName}/${version}`;
    const packageInfo = await this.fetchJson(registryUrl);

    if (!packageInfo?.dist?.tarball) {
      throw new CodxError(`Failed to get tarball URL for ${packageName}@${version}`);
    }

    const tarballUrl = packageInfo.dist.tarball;
    const tarballPath = join(tempDir, 'package.tgz');

    // Download the tarball
    await this.downloadFile(tarballUrl, tarballPath);

    // Extract the tarball
    await this.extractTarball(tarballPath, tempDir);

    // Return the path to the package directory
    return join(tempDir, 'package');
  }

  /**
   * Downloads a file from a URL
   * @param url URL to download
   * @param destination Destination path
   */
  private async downloadFile(url: string, destination: string): Promise<void> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new CodxError(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const fileStream = createWriteStream(destination);

    if (response.body) {
      const readableStream = Readable.from(response.body);

      // Rediriger le stream vers le fichier
      readableStream.pipe(fileStream);

      // Attendre que le téléchargement soit terminé
      return new Promise((resolve, reject) => {
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', (error) => {
          fileStream.close();
          reject(new CodxError(`Failed to download ${url}`, error));
        });
      });
    }
  }

  /**
   * Extracts a tarball
   * @param tarballPath Path to the tarball
   * @param destination Destination directory
   */
  private async extractTarball(tarballPath: string, destination: string): Promise<void> {
    try {
      await extract({
        file: tarballPath,
        cwd: destination,
      });
    } catch (error) {
      throw new CodxError('Failed to extract tarball', error);
    }
  }

  /**
   * Fetches JSON from a URL
   * @param url URL to fetch
   * @returns Parsed JSON
   */
  private async fetchJson(url: string): Promise<any> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new CodxError(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Gets the npm package name for a recipe
   * @param recipeName Recipe name
   * @returns Full package name
   */
  private getPackageName(recipeName: string): string {
    return `${recipeName}-codx-recipe`;
  }

  private isPath(recipePath: string): boolean {
    return !/^[a-zA-Z0-9-]+$/.exec(recipePath) || existsSync(recipePath);
  }

  private async loadRecipe(recipePath: string): Promise<Recipe> {
    let recipe: Recipe;

    try {
      const fileContent = await readFile(recipePath, 'utf8');

      recipe = load(fileContent) as Recipe;
    } catch (error) {
      throw new CodxError('Failed to load recipe', error);
    }

    const result = RecipeSchema.safeParse(recipe);
    if (!result.success) {
      throw new CodxError(
        'Invalid recipe schema:\n' +
          z
            .prettifyError(result.error)
            .split('\n')
            .map((line) => `  ${line}`)
            .join('\n'),
      );
    }

    return result.data;
  }

  /**
   * Parses a package identifier into name and version
   * @param packageIdentifier Package identifier (e.g. "my-recipe" or "my-recipe@1.0.0")
   * @returns Object with name and version
   */
  private parsePackageVersion(packageIdentifier: string): { name: string; version: string } {
    const parts = packageIdentifier.split('@');
    const name = parts[0];
    const version = parts.length > 1 ? parts[1] : 'latest';

    return { name, version };
  }

  private resolveRecipePath(recipePath: string): string {
    try {
      return resolve(recipePath);
    } catch (error) {
      throw new CodxError('Failed to find recipe', error);
    }
  }
}
