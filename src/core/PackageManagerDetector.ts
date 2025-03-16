import { Inject } from '@/di/InjectDecorator';
import { Store } from '@/core/Store';

export type PackageManager = {
  install: string;
  installDev: string;
  remove: string;
  update: string;
  execute: string;
  globalOption: string;
};

export const PACKAGE_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const;
export type PackageManagers = (typeof PACKAGE_MANAGERS)[number];

export const PACKAGE_COMMANDS: Record<PackageManagers, PackageManager> = {
  npm: {
    install: 'npm install -P',
    installDev: 'npm install -D',
    remove: 'npm uninstall',
    update: 'npm update',
    execute: 'npx --yes',
    globalOption: '-g',
  },
  yarn: {
    install: 'yarn add',
    installDev: 'yarn add -D',
    remove: 'yarn remove',
    update: 'yarn upgrade',
    execute: 'yarn dlx --yes',
    globalOption: 'global',
  },
  pnpm: {
    install: 'pnpm add',
    installDev: 'pnpm add -D',
    remove: 'pnpm remove',
    update: 'pnpm update',
    execute: 'pnpm dlx --yes',
    globalOption: '-g',
  },
  bun: {
    install: 'bun add',
    installDev: 'bun add -D',
    remove: 'bun remove',
    update: 'bun update',
    execute: 'bunx --yes',
    globalOption: '-g',
  },
};

export class PackageManagerDetector {
  constructor(@Inject(Store) private readonly store: Store) {}

  /**
   * Detects the package manager
   * @param pm Optional package manager to validate or detect
   * @returns The detected package manager
   */
  public detect(pm?: PackageManagers) {
    // Auto-detect package manager if provided package manager is empty or not allowed
    if (!pm || !PACKAGE_MANAGERS.includes(pm)) {
      const runner = (process.env['_'] ?? process.argv0)
        .toLowerCase()
        .replace(/\.exe$/, '')
        .split(/[\\/]/)
        .pop() as PackageManagers;

      for (const packageManager of ['node', ...PACKAGE_MANAGERS]) {
        if (runner.includes(packageManager)) {
          pm = packageManager === 'node' ? 'npm' : (packageManager as PackageManagers);

          break;
        }
      }

      if (!pm) {
        // If no package manager found, default to npm
        pm = 'npm';
      }
    }

    this.store.setInternal('$PACKAGE_MANAGER', pm);
    this.store.setInternal('$PACKAGE_COMMANDS', PACKAGE_COMMANDS[pm]);
  }
}
