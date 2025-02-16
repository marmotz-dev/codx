import { LoggerService } from '@/services/logger';
import { shell } from '@/services/shell';

export type PackageManagerType = 'npm' | 'pnpm' | 'yarn' | 'bun';

export class PackageManagerService {
  private static instance: PackageManagerService;
  private selectedPM: PackageManagerType | null = null;
  private logger = LoggerService.getInstance();

  private constructor() {}

  static getInstance(): PackageManagerService {
    if (!PackageManagerService.instance) {
      PackageManagerService.instance = new PackageManagerService();
    }

    return PackageManagerService.instance;
  }

  getInstallCommand(packageName: string, isDev: boolean = false, exact: boolean = false): string {
    if (!this.selectedPM) {
      throw new Error('No package manager selected');
    }

    const exactFlag = exact
      ? this.selectedPM === 'npm' || this.selectedPM === 'pnpm'
        ? '--save-exact '
        : '--exact '
      : '';

    const devFlag = isDev ? '-D ' : '';

    switch (this.selectedPM) {
      case 'npm':
        return `npm install ${devFlag}${exactFlag}${packageName}`;
      case 'pnpm':
        return `pnpm add ${devFlag}${exactFlag}${packageName}`;
      case 'yarn':
        return `yarn add ${devFlag}${exactFlag}${packageName}`;
      case 'bun':
        return `bun add ${devFlag}${exactFlag}${packageName}`;
      default:
        throw new Error('No package manager selected');
    }
  }

  async loadDefaultPackageManager(): Promise<PackageManagerType> {
    if (!this.selectedPM) {
      this.selectedPM = await this.detectPackageManager();
    }

    return this.selectedPM;
  }

  setPackageManager(pm: PackageManagerType): void {
    this.selectedPM = pm;
    this.logger.success(`Using package manager: ${pm}`);
  }

  private async checkCommandExists(command: string): Promise<boolean> {
    try {
      await shell(`${command} -v`);

      return true;
    } catch {
      return false;
    }
  }

  private async detectPackageManager(): Promise<PackageManagerType> {
    this.logger.infoGroup('Detecting package manager :');
    const packageManagers: PackageManagerType[] = ['bun', 'pnpm', 'yarn', 'npm'];

    for (const pm of packageManagers) {
      this.logger.check(`Checking for ${pm}...`);

      if (await this.checkCommandExists(pm)) {
        this.logger.successGroupEnd(`Found ${pm}`);

        return pm;
      }

      this.logger.info(`${pm} not found`);
    }

    this.logger.errorGroupEnd('No package manager found');

    throw new Error('No package manager found');
  }
}
