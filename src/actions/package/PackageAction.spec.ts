import { PackageAction } from '@/actions/package/PackageAction';
import {
  PackageActionInstallData,
  PackageActionRemoveData,
  PackageActionRunData,
  PackageActionUpdateData,
} from '@/actions/package/PackageAction.schema';
import { EmptyPackageCodxError } from '@/core/errors/EmptyPackageCodxError';
import { EmptyPackageListCodxError } from '@/core/errors/EmptyPackageListCodxError';
import { PackageManagerNotFoundCodxError } from '@/core/errors/PackageManagerNotFoundCodxError';
import { PACKAGE_COMMANDS } from '@/core/PackageManagerDetector';
import { Store } from '@/core/Store';
import { diContainer } from '@/di/Container';
import { MockCleaner, mockModule } from '@/testHelpers/mockModule';
import { setupConsole } from '@/testHelpers/setupConsole';
import { afterEach, beforeEach, describe, expect, Mock, mock, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';

describe('PackageAction', () => {
  setupConsole();

  const mockPackageManager = 'npm';
  const mockPackageCommands = PACKAGE_COMMANDS[mockPackageManager];
  const mockPackages = ['package1', 'package2'];

  let executeCommandSpy: Mock<any>;
  let action: PackageAction;
  let store: Store;

  beforeEach(() => {
    diContainer.reset();
    store = diContainer.get(Store);
    store.setInternal('$PACKAGE_COMMANDS', mockPackageCommands);

    action = diContainer.get(PackageAction);

    executeCommandSpy = mock();
    (action as any).executeCommand = executeCommandSpy;
  });

  describe('check', () => {
    describe('error', () => {
      test('should throw error when package list is empty', async () => {
        const actionData1 = {
          type: 'package',
          operation: 'check',
          packages: [],
        } as any;

        expect(action.execute(actionData1)).rejects.toThrow(EmptyPackageListCodxError);
        expect(action.execute(actionData1)).rejects.toThrow('Package list is empty or invalid.');

        const actionData2 = {
          type: 'package',
          operation: 'check',
          packages: null,
        } as any;

        expect(action.execute(actionData2)).rejects.toThrow(EmptyPackageListCodxError);
        expect(action.execute(actionData2)).rejects.toThrow('Package list is empty or invalid.');
      });
    });

    describe('success', () => {
      test('should return package status when package is not installed', async () => {
        // Mock getPackageVersion to return null (package not installed)
        const getPackageVersionSpy = mock(() => null);
        (action as any).getPackageVersion = getPackageVersionSpy;

        const result = await action.execute({
          type: 'package',
          operation: 'check',
          packages: [{ package: 'not-installed-package' }],
        } as any);

        expect(getPackageVersionSpy).toHaveBeenCalledWith('not-installed-package');
        expect(result).toEqual({
          'not-installed-package': {
            check: false,
            installed: false,
          },
        });
      });

      test('should return correct package status when package is installed and satisfies version constraints', async () => {
        // Mock getPackageVersion to return a version
        const getPackageVersionSpy = mock(() => '2.0.0');
        (action as any).getPackageVersion = getPackageVersionSpy;

        const result = await action.execute({
          type: 'package',
          operation: 'check',
          packages: [
            {
              package: 'test-package',
              minVersion: '1.0.0',
              maxVersion: '3.0.0',
            },
          ],
        } as any);

        expect(getPackageVersionSpy).toHaveBeenCalledWith('test-package');
        expect(result).toEqual({
          'test-package': {
            check: true,
            installed: true,
            version: '2.0.0',
            hasMinVersion: true,
            hasMaxVersion: true,
          },
        });
      });

      test('should return failed check when package version is lower than minVersion', async () => {
        // Mock getPackageVersion to return a version lower than minVersion
        const getPackageVersionSpy = mock(() => '1.0.0');
        (action as any).getPackageVersion = getPackageVersionSpy;

        const result = await action.execute({
          type: 'package',
          operation: 'check',
          packages: [
            {
              package: 'test-package',
              minVersion: '2.0.0',
            },
          ],
        } as any);

        expect(getPackageVersionSpy).toHaveBeenCalledWith('test-package');
        expect(result).toEqual({
          'test-package': {
            check: false,
            installed: true,
            version: '1.0.0',
            hasMinVersion: false,
          },
        });
      });

      test('should return failed check when package version is higher than maxVersion', async () => {
        // Mock getPackageVersion to return a version higher than maxVersion
        const getPackageVersionSpy = mock(() => '3.0.0');
        (action as any).getPackageVersion = getPackageVersionSpy;

        const result = await action.execute({
          type: 'package',
          operation: 'check',
          packages: [
            {
              package: 'test-package',
              maxVersion: '2.0.0',
            },
          ],
        } as any);

        expect(getPackageVersionSpy).toHaveBeenCalledWith('test-package');
        expect(result).toEqual({
          'test-package': {
            check: false,
            installed: true,
            version: '3.0.0',
            hasMaxVersion: false,
          },
        });
      });
    });
  });

  describe('install', () => {
    describe('error', () => {
      test('should throw error when package list is empty', async () => {
        const actionData = {
          type: 'package',
          operation: 'install',
          packages: [],
        } as unknown as PackageActionInstallData;

        expect(action.execute(actionData)).rejects.toThrow(EmptyPackageListCodxError);
        expect(action.execute(actionData)).rejects.toThrow('Package list is empty or invalid.');
      });

      test('should throw error when package manager is not found', async () => {
        store.setInternal('$PACKAGE_COMMANDS', undefined);

        const actionData = {
          type: 'package',
          operation: 'install',
          packages: ['package'],
        } as unknown as PackageActionInstallData;

        expect(action.execute(actionData)).rejects.toThrow(PackageManagerNotFoundCodxError);
        expect(action.execute(actionData)).rejects.toThrow('Package manager not found.');

        store.setInternal('$PACKAGE_COMMANDS', mockPackageCommands);
      });
    });

    describe('success', () => {
      test('should execute install command with default options', async () => {
        // Execute the action
        await action.execute({
          type: 'package',
          operation: 'install',
          packages: mockPackages,
        } as PackageActionInstallData);

        // Verify executeCommand was called with the correct parameters
        expect(executeCommandSpy).toHaveBeenCalledWith(
          `${mockPackageCommands.install} ${mockPackages.join(' ')}`,
          false,
        );
      });

      test('should execute install command with dev option', async () => {
        // Execute the action
        await action.execute({
          type: 'package',
          operation: 'install',
          packages: mockPackages,
          dev: true,
        } as PackageActionInstallData);

        // Verify executeCommand was called with the correct parameters
        expect(executeCommandSpy).toHaveBeenCalledWith(
          `${mockPackageCommands.installDev} ${mockPackages.join(' ')}`,
          false,
        );
      });
    });
  });

  describe('remove', () => {
    describe('error', () => {
      test('should throw error when package list is empty', async () => {
        const actionData = {
          type: 'package',
          operation: 'remove',
          packages: [],
        } as unknown as PackageActionRemoveData;

        expect(action.execute(actionData)).rejects.toThrow(EmptyPackageListCodxError);
        expect(action.execute(actionData)).rejects.toThrow('Package list is empty or invalid.');
      });

      test('should throw error when package manager is not found', async () => {
        store.setInternal('$PACKAGE_COMMANDS', undefined);

        const actionData = {
          type: 'package',
          operation: 'remove',
          packages: ['package'],
        } as unknown as PackageActionInstallData;

        expect(action.execute(actionData)).rejects.toThrow(PackageManagerNotFoundCodxError);
        expect(action.execute(actionData)).rejects.toThrow('Package manager not found.');

        store.setInternal('$PACKAGE_COMMANDS', mockPackageCommands);
      });
    });

    describe('success', () => {
      test('should execute remove command', async () => {
        // Execute the action
        await action.execute({
          type: 'package',
          operation: 'remove',
          packages: mockPackages,
        } as PackageActionRemoveData);

        // Verify executeCommand was called with the correct parameters
        expect(executeCommandSpy).toHaveBeenCalledWith(
          `${mockPackageManager} uninstall ${mockPackages.join(' ')}`,
          false,
        );
      });
    });
  });

  describe('update', () => {
    describe('error', () => {
      test('should throw error when package list is empty', async () => {
        const actionData = {
          type: 'package',
          operation: 'update',
          packages: [],
        } as unknown as PackageActionRemoveData;

        expect(action.execute(actionData)).rejects.toThrow(EmptyPackageListCodxError);
        expect(action.execute(actionData)).rejects.toThrow('Package list is empty or invalid.');
      });

      test('should throw error when package manager is not found', async () => {
        store.setInternal('$PACKAGE_COMMANDS', undefined);

        const actionData = {
          type: 'package',
          operation: 'update',
          packages: ['package'],
        } as unknown as PackageActionInstallData;

        expect(action.execute(actionData)).rejects.toThrow(PackageManagerNotFoundCodxError);
        expect(action.execute(actionData)).rejects.toThrow('Package manager not found.');

        store.setInternal('$PACKAGE_COMMANDS', mockPackageCommands);
      });
    });

    describe('success', () => {
      test('should execute update command', async () => {
        // Execute the action
        await action.execute({
          type: 'package',
          operation: 'update',
          packages: mockPackages,
        } as PackageActionUpdateData);

        // Verify executeCommand was called with the correct parameters
        expect(executeCommandSpy).toHaveBeenCalledWith(`${mockPackageManager} update ${mockPackages.join(' ')}`, false);
      });
    });
  });

  describe('run', () => {
    const mockPackageName = 'test-package';
    const mockOptions = '--option1 --option2';

    describe('error', () => {
      test('should throw error when package name is not provided', async () => {
        const actionData = {
          type: 'package',
          operation: 'run',
          options: mockOptions,
        } as PackageActionRunData;

        expect(action.execute(actionData)).rejects.toThrow(EmptyPackageCodxError);
        expect(action.execute(actionData)).rejects.toThrow('Package is empty.');
      });

      test('should throw error when package manager is not found', async () => {
        store.setInternal('$PACKAGE_COMMANDS', undefined);

        const actionData = {
          type: 'package',
          operation: 'run',
          package: 'package',
        } as unknown as PackageActionRunData;

        expect(action.execute(actionData)).rejects.toThrow(PackageManagerNotFoundCodxError);
        expect(action.execute(actionData)).rejects.toThrow('Package manager not found.');

        store.setInternal('$PACKAGE_COMMANDS', mockPackageCommands);
      });
    });

    describe('success', () => {
      test('should execute command with package name only', async () => {
        // Execute the action
        await action.execute({
          type: 'package',
          operation: 'run',
          package: mockPackageName,
        } as PackageActionRunData);

        // Verify executeCommand was called with the correct parameters
        expect(executeCommandSpy).toHaveBeenCalledWith(`${mockPackageCommands.execute} ${mockPackageName}`);
      });

      test('should execute command with options', async () => {
        // Execute the action
        await action.execute({
          type: 'package',
          operation: 'run',
          package: mockPackageName,
          options: mockOptions,
        } as PackageActionRunData);

        // Verify executeCommand was called with the correct parameters
        expect(executeCommandSpy).toHaveBeenCalledWith(
          `${mockPackageCommands.execute} ${mockPackageName} ${mockOptions}`,
        );
      });
    });
  });

  describe('getPackageVersion', () => {
    let mockFsCleaner: MockCleaner;

    beforeEach(async () => {
      mockFsCleaner = await mockModule('fs', () => ({
        existsSync: mock(),
        readFileSync: mock(),
      }));
    });

    afterEach(() => {
      mockFsCleaner();
    });

    test('should return undefined when package.json does not exist', () => {
      const fsExistsSyncSpy = (existsSync as any).mockReturnValue(false);

      const result = action['getPackageVersion']('test-package');

      expect(fsExistsSyncSpy).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    test('should return version', () => {
      const fsExistsSyncSpy = (existsSync as Mock<any>).mockReturnValue(true);
      const fsReadFileSyncSpy = (readFileSync as Mock<any>).mockReturnValue(
        JSON.stringify({
          version: '2.0.0',
        }),
      );

      const result = action['getPackageVersion']('test-package');

      expect(fsExistsSyncSpy).toHaveBeenCalled();
      expect(fsReadFileSyncSpy).toHaveBeenCalled();
      expect(result).toBe('2.0.0');
    });
  });
});
