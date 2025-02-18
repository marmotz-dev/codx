import { LoggerService } from '@/services/logger';
import { PackageManagerService } from '@/services/packageManager';
import { shell } from '@/services/shell';
import { Action, ActionContext } from '@/types/action.type';
import { AddPackagesArgs, Package } from '@/types/actions/addPackages.type';

export const addPackages: Action<AddPackagesArgs> = async ({
  args: { dependencies, devDependencies },
}: ActionContext<AddPackagesArgs>): Promise<void> => {
  const logger = LoggerService.getInstance();
  const pmService = PackageManagerService.getInstance();

  if ((!dependencies || dependencies.length === 0) && (!devDependencies || devDependencies.length === 0)) {
    throw new Error('At least one package must be specified for the "addPackages" action');
  }

  const formatPackage = (pkg: Package): { name: string; exact: boolean } => {
    if (typeof pkg === 'string') {
      return {
        name: pkg,
        exact: false,
      };
    }

    return {
      name: pkg.name,
      exact: pkg.exact || false,
    };
  };

  const installPackages = async (packages: Package[], isDev: boolean) => {
    for (const pkg of packages) {
      const { name, exact } = formatPackage(pkg);
      const command = pmService.getInstallCommand(name, isDev, exact);

      logger.info(`Installing ${name}...`);

      const { error } = await shell(command);
      if (error) {
        logger.error(`Failed to install ${name}`);

        throw error;
      } else {
        logger.success(`Successfully installed ${name}`);
      }
    }
  };

  if (dependencies && dependencies.length > 0) {
    await installPackages(dependencies, false);
  }

  if (devDependencies && devDependencies.length > 0) {
    await installPackages(devDependencies, true);
  }
};
