import { PackageManagerService } from '@/services/packageManager';
import { MockCleaner, mockModule } from '@/tests/mockModule';
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';

describe('PackageManagerService', () => {
  let service: PackageManagerService;

  beforeEach(() => {
    service = PackageManagerService.getInstance();
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
          if (command.includes('pnpm')) {
            return true;
          }

          throw new Error();
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
