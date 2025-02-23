// import { Readable } from 'stream';
import { loggerService } from '@/services/logger';
// import { extract as tarExtract } from 'tar';
import { Recipe } from '@/services/recipe.type';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { load } from 'js-yaml';
// import { finished } from 'node:stream/promises';
// import { type ReadableStream } from 'node:stream/web';
// import * as os from 'os';
import { dirname, resolve } from 'path';

// interface NpmPackageData {
//   'dist-tags': {
//     latest: string;
//   };
//   versions: {
//     [version: string]: {
//       dist: {
//         tarball: string;
//       };
//     };
//   };
// }

const logger = loggerService;

export async function loadRecipe(recipeIdentifier: string): Promise<{ recipe: Recipe; recipeDirectory: string }> {
  try {
    let recipePath: string;

    if (isYamlFile(recipeIdentifier)) {
      logger.info(`Loading recipe from file ${recipeIdentifier}`);
      recipePath = resolve(recipeIdentifier);
    } else {
      throw new Error('Remote packages are not supported');
      // const { name, version } = this.parsePackageVersion(recipeIdentifier);
      // const packageName = this.getPackageName(name);
      // recipePath = await this.downloadAndExtractPackage(packageName, version);
    }

    if (!existsSync(recipePath)) {
      throw new Error(`Recipe file not found: ${recipePath}`);
    }

    const fileContent = await readFile(recipePath, 'utf8');

    return {
      recipe: load(fileContent) as Recipe,
      recipeDirectory: dirname(recipePath),
    };
  } catch (error) {
    throw new Error(`Failed to load recipe: ${(error as Error).message}`);
  }
}

function isYamlFile(recipePath: string): boolean {
  return recipePath.endsWith('.yml') || recipePath.endsWith('.yaml');
}

// private createTempDir(): string {
//   return fs.mkdtempSync(path.join(os.tmpdir(), 'codx-'));
// }

// private async downloadAndExtractPackage(packageName: string, version?: string): Promise<string> {
//   const tempDir = this.createTempDir();
//
//   try {
//     const packageData = await this.fetchPackageData(packageName);
//     const targetVersion = version || packageData['dist-tags'].latest;
//
//     if (!packageData.versions[targetVersion]) {
//       throw new Error(`Version ${targetVersion} not found for package ${packageName}`);
//     }
//
//     const tarballUrl = packageData.versions[targetVersion].dist.tarball;
//     await this.downloadAndExtractTarball(tarballUrl, tempDir);
//
//     return this.findRecipeFile(tempDir);
//   } catch (error) {
//     fs.rmSync(tempDir, { recursive: true, force: true });
//     throw error;
//   }
// }

// private async downloadAndExtractTarball(url: string, destDir: string): Promise<void> {
//   console.log(url, destDir);
//   logger.info('Downloading recipe package...');
//   const response = await fetch(url);
//
//   if (!response.ok) {
//     throw new Error(`Failed to download package: ${response.statusText}`);
//   }
//
//   if (!response.body) {
//     throw new Error('No response body received');
//   }
//
//   await new Promise<void>((resolve, reject) => {
//     const extract = tarExtract({ cwd: destDir });
//     extract.on('error', reject);
//     extract.on('end', resolve);
//
//     if (!response.body) {
//       throw new Error('No response body received');
//     }
//
//     return finished(Readable.fromWeb(response.body as unknown as ReadableStream<Uint8Array>).pipe(extract));
//   });
// }

// private async fetchPackageData(packageName: string): Promise<NpmPackageData> {
//   const response = await fetch(`https://registry.npmjs.org/${packageName}`);
//
//   if (!response.ok) {
//     if (response.status === 404) {
//       throw new Error(`Recipe package not found: ${packageName}`);
//     }
//     throw new Error(`Failed to fetch package data: ${response.statusText}`);
//   }
//
//   return (await response.json()) as Promise<NpmPackageData>;
// }
//
// private findRecipeFile(dir: string): string {
//   const recipeFile = path.join(dir, 'package', 'recipe.yml');
//   if (!fs.existsSync(recipeFile)) {
//     throw new Error('recipe.yml not found in package');
//   }
//
//   return recipeFile;
// }
//
// private getPackageName(recipeName: string): string {
//   return `codx-${recipeName}-recipe`;
// }

// private parsePackageVersion(recipeName: string): { name: string; version?: string } {
//   const [name, version] = recipeName.split('@');
//
//   return { name, version };
// }
