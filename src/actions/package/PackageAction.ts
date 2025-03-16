import { BaseCommandAction } from '@/actions/BaseCommandAction';
import {
  PackageActionCheckData,
  PackageActionData,
  PackageActionInstallData,
  PackageActionRemoveData,
  PackageActionRunData,
  PackageActionUpdateData,
} from '@/actions/package/PackageAction.schema';
import { CodxError } from '@/core/CodxError';
import { PackageManager } from '@/core/PackageManagerDetector';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gt, lt } from 'semver';

type CheckResult = {
  check: boolean;
  installed: boolean;
  version?: string;
  hasMinVersion?: boolean;
  hasMaxVersion?: boolean;
};

/**
 * Action to manage npm packages
 */
export class PackageAction extends BaseCommandAction {
  /**
   * Executes the package action
   * @param {PackageActionData} actionData Action data
   */
  public async execute(actionData: PackageActionData) {
    const { operation } = actionData;

    switch (operation) {
      case 'check':
        return this.executeCheck(actionData);

      case 'install':
        return this.executeInstall(actionData);

      case 'remove':
        return this.executeRemove(actionData);

      case 'run':
        return this.executeRun(actionData);

      case 'update':
        return this.executeUpdate(actionData);
    }
  }

  private checkPackage(pkgInfo: { package: string; minVersion?: string; maxVersion?: string }) {
    const { package: packageName, minVersion, maxVersion } = pkgInfo;
    const version = this.getPackageVersion(packageName);

    const packageResult: CheckResult = {
      installed: !!version,
      check: !!version,
    };

    if (!version) {
      return packageResult;
    }

    packageResult.version = version;

    this.logger.info(`Package "${packageName}" found with version ${version}.`);

    if (minVersion) {
      packageResult.hasMinVersion = !lt(version, minVersion);

      if (!packageResult.hasMinVersion) {
        this.logger.error(`The minimum required version is ${minVersion}, but the installed version is ${version}.`);
        packageResult.check = false;
      }
    }

    if (maxVersion) {
      packageResult.hasMaxVersion = !gt(version, maxVersion);

      if (!packageResult.hasMaxVersion) {
        this.logger.error(`The maximum allowed version is ${maxVersion}, but the installed version is ${version}.`);
        packageResult.check = false;
      }
    }

    return packageResult;
  }

  private async executeCheck(action: PackageActionCheckData) {
    const { packages } = action;

    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      throw new CodxError('Package list is empty or invalid.');
    }

    const result: Record<string, CheckResult> = {};

    for (const pkgInfo of packages) {
      result[pkgInfo.package] = this.checkPackage(pkgInfo);
    }

    return result;
  }

  private async executeInstall(action: PackageActionInstallData) {
    const { packages, dev } = action;

    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      throw new CodxError('Package list is empty or invalid.');
    }

    const packageCommands = this.context.store.get<PackageManager>('$PACKAGE_COMMANDS');
    if (!packageCommands) {
      throw new CodxError('Package manager not found.');
    }

    let command = '';

    // Add options based on parameters
    if (dev) {
      command += packageCommands.installDev;
    } else {
      command += packageCommands.install;
    }

    command += ` ${packages.join(' ')}`;

    return this.executeCommand(command.trim(), false);
  }

  private async executeRemove(action: PackageActionRemoveData) {
    const { packages } = action;

    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      throw new CodxError('Package list is empty or invalid.');
    }

    const packageCommands = this.context.store.get<PackageManager>('$PACKAGE_COMMANDS');
    if (!packageCommands) {
      throw new CodxError('Package manager not found.');
    }

    let command = packageCommands.remove;

    command += ` ${packages.join(' ')}`;

    return this.executeCommand(command, false);
  }

  /**
   * Executes the runPackage action
   * @param {PackageActionRunData} actionData Action data
   */
  private async executeRun(actionData: PackageActionRunData) {
    const { package: packageName, options = '' } = actionData;

    if (!packageName) {
      throw new CodxError('Package is empty.');
    }

    const packageCommands = this.context.store.get<PackageManager>('$PACKAGE_COMMANDS');
    if (!packageCommands) {
      throw new CodxError('Package manager not found.');
    }

    const command = `${packageCommands.execute} ${packageName} ${options}`.trim();

    return this.executeCommand(command);
  }

  private async executeUpdate(action: PackageActionUpdateData) {
    const { packages } = action;

    if (!packages || !Array.isArray(packages) || packages.length === 0) {
      throw new CodxError('Package list is empty or invalid.');
    }

    const packageCommands = this.context.store.get<PackageManager>('$PACKAGE_COMMANDS');
    if (!packageCommands) {
      throw new CodxError('Package manager not found.');
    }

    let command = packageCommands.update;

    command += ` ${packages.join(' ')}`;

    return this.executeCommand(command, false);
  }

  /**
   * Gets the version of an installed package
   * @param packageName The package name
   * @returns The package version or null if not installed
   */
  private getPackageVersion(packageName: string): string | undefined {
    // Try to read the version from local package.json
    try {
      const workingDir = this.context.projectDirectory.get();
      const packageJsonPath = join(workingDir, 'node_modules', packageName, 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.version) {
          return packageJson.version;
        }
      }
    } catch (error) {
      throw new CodxError('Error reading package.json', error);
    }
  }
}
