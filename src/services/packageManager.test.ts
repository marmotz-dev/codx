import { PackageManagerService } from '@/services/packageManager';
import { ShellResult } from '@/services/shell';
import { MockCleaner, mockModule } from '@/test-helpers/mockModule';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';

describe('PackageManagerService', () => {
  let service: PackageManagerService;

  beforeEach(() => {
    service = new PackageManagerService();
  });

  afterEach(() => {
    service['selectedPM'] = null;
  });

  describe('getInstallCommand', () => {
    it('should return npm install command', () => {
      service.setPackageManager('npm');
      expect(service.getInstallCommand('lodash')).toBe('npm install lodash');
    });

    it('should return pnpm add command', () => {
      service.setPackageManager('pnpm');
      expect(service.getInstallCommand('lodash')).toBe('pnpm add lodash');
    });

    it('should return yarn add command', () => {
      service.setPackageManager('yarn');
      expect(service.getInstallCommand('lodash')).toBe('yarn add lodash');
    });

    it('should return bun add command', () => {
      service.setPackageManager('bun');
      expect(service.getInstallCommand('lodash')).toBe('bun add lodash');
    });
  });

  describe('detectPackageManager', () => {
    let cleanMock: MockCleaner;

    beforeEach(async () => {
      cleanMock = await mockModule('@/services/shell', () => ({
        shell: (command: string) => {
          const result = {
            error: null,
            exitCode: 0,
            stdout: '',
            stderr: '',
          } as ShellResult;

          if (!command.includes('pnpm')) {
            result.error = new Error();
            result.exitCode = 1;
          }

          return result;
        },
      }));
    });

    afterEach(() => {
      cleanMock();
    });

    it('should detect available package manager', async () => {
      const pm = await service.loadDefaultPackageManager();
      expect(pm).toBe('pnpm');
    });
  });
});
