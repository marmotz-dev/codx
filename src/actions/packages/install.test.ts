import { packagesInstallAction } from '@/actions/packages/install';
import { packageManagerService } from '@/services/packageManager';
import { argsToContext } from '@/test-helpers/actionContext';
import { MockCleaner, mockModule } from '@/test-helpers/mockModule';
import { afterEach, beforeEach, describe, expect, it, Mock, spyOn } from 'bun:test';

describe('packagesInstall action', () => {
  let getInstallCommandSpy: Mock<(packageName: string, isDev?: boolean, exact?: boolean) => string>;
  let cleanShellMock: MockCleaner;

  beforeEach(async () => {
    packageManagerService.setPackageManager('npm');

    getInstallCommandSpy = spyOn(packageManagerService, 'getInstallCommand');

    cleanShellMock = await mockModule('../services/shell', () => ({
      shell: () =>
        Promise.resolve({
          error: null,
          exitCode: 0,
          stdout: '',
          stderr: '',
        }),
    }));
  });

  afterEach(() => {
    getInstallCommandSpy.mockClear();
    cleanShellMock();
  });

  it('should install dependencies correctly', async () => {
    const deps = ['lodash', { name: 'express@4.18.2', exact: true }];

    await packagesInstallAction(argsToContext({ dependencies: deps }));

    expect(getInstallCommandSpy).nthCalledWith(1, 'lodash', false, false);
    expect(getInstallCommandSpy).nthCalledWith(2, 'express@4.18.2', false, true);
  });

  it('should install devDependencies correctly', async () => {
    const devDeps = ['@types/lodash', { name: '@types/express@4.17.17' }];

    await packagesInstallAction(argsToContext({ devDependencies: devDeps }));

    expect(getInstallCommandSpy).nthCalledWith(1, '@types/lodash', true, false);
    expect(getInstallCommandSpy).nthCalledWith(2, '@types/express@4.17.17', true, false);
  });

  it('should throw error when no package was specifed', async () => {
    let result = packagesInstallAction(argsToContext({}));
    expect(result).rejects.toThrow('At least one package must be specified for the "packagesInstall" action');

    result = packagesInstallAction(argsToContext({ dependencies: [] }));
    expect(result).rejects.toThrow('At least one package must be specified for the "packagesInstall" action');

    result = packagesInstallAction(argsToContext({ devDependencies: [] }));
    expect(result).rejects.toThrow('At least one package must be specified for the "packagesInstall" action');
  });

  it('should throw error when package is unavailable', async () => {
    await mockModule('../services/shell', () => ({
      shell: () =>
        Promise.resolve({
          error: new Error('Command failed'),
          exitCode: 127,
          stdout: '',
          stderr: 'Package not found: non-existent-package',
        }),
    }));

    let result = packagesInstallAction(argsToContext({ dependencies: ['non-existent-package'] }));
    expect(result).rejects.toThrow('Command failed');
  });
});
