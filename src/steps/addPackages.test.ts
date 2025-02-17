import { PackageManagerService } from '@/services/packageManager';
import { addPackages } from '@/steps/addPackages';
import { MockCleaner, mockModule } from '@/tests/mockModule';
import { argsToContext } from '@/tests/stepContext';
import { afterEach, beforeEach, describe, expect, it, Mock, spyOn } from 'bun:test';

describe('addPackages', () => {
  let getInstallCommandSpy: Mock<(packageName: string, isDev?: boolean, exact?: boolean) => string>;
  let cleanShellMock: MockCleaner;

  beforeEach(async () => {
    PackageManagerService.getInstance().setPackageManager('npm');

    getInstallCommandSpy = spyOn(PackageManagerService.prototype, 'getInstallCommand');

    cleanShellMock = await mockModule('../services/shell', () => ({
      shell: (command: string) => {
        console.log(`>>> Mocked exec called with: ${command} <<<`);

        return Promise.resolve({
          error: null,
          exitCode: 0,
          stdout: '',
          stderr: '',
        });
      },
    }));
  });

  afterEach(() => {
    getInstallCommandSpy.mockClear();
    cleanShellMock();
  });

  it('should install dependencies correctly', async () => {
    const deps = ['lodash', { name: 'express@4.18.2', exact: true }];

    await addPackages(argsToContext({ dependencies: deps }));

    expect(getInstallCommandSpy).nthCalledWith(1, 'lodash', false, false);
    expect(getInstallCommandSpy).nthCalledWith(2, 'express@4.18.2', false, true);
  });

  it('should install devDependencies correctly', async () => {
    const devDeps = ['@types/lodash', { name: '@types/express@4.17.17' }];

    await addPackages(argsToContext({ devDependencies: devDeps }));

    expect(getInstallCommandSpy).nthCalledWith(1, '@types/lodash', true, false);
    expect(getInstallCommandSpy).nthCalledWith(2, '@types/express@4.17.17', true, false);
  });

  it('should throw error when no package was specifed', async () => {
    let result = addPackages(argsToContext({}));
    expect(result).rejects.toThrow('At least one package must be specified for the "addPackages" step');

    result = addPackages(argsToContext({ dependencies: [] }));
    expect(result).rejects.toThrow('At least one package must be specified for the "addPackages" step');

    result = addPackages(argsToContext({ devDependencies: [] }));
    expect(result).rejects.toThrow('At least one package must be specified for the "addPackages" step');
  });

  it('should throw error when package is unavailable', async () => {
    await mockModule('../services/shell', () => ({
      shell: (command: string) => {
        console.log(`>>> Mocked exec called with: ${command} <<<`);

        return Promise.resolve({
          error: new Error('Command failed'),
          exitCode: 127,
          stdout: '',
          stderr: 'Package not found: non-existent-package',
        });
      },
    }));

    let result = addPackages(argsToContext({ dependencies: ['non-existent-package'] }));
    expect(result).rejects.toThrow('Command failed');
  });
});
