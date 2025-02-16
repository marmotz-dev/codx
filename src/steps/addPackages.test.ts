import { PackageManagerService } from '@/services/packageManager';
import { addPackages } from '@/steps/addPackages';
import { MockCleaner, mockModule } from '@/tests/mockModule';
import { argsToContext } from '@/tests/stepContext';
import { afterEach, beforeEach, describe, expect, it, Mock, spyOn, test } from 'bun:test';

describe('addPackages', () => {
  let getInstallCommandSpy: Mock<(packageName: string, isDev?: boolean, exact?: boolean) => string>;
  let cleanShellMock: MockCleaner;

  beforeEach(async () => {
    PackageManagerService.getInstance().setPackageManager('npm');

    getInstallCommandSpy = spyOn(PackageManagerService.prototype, 'getInstallCommand');

    cleanShellMock = await mockModule('../services/shell', () => ({
      shell: (command: string) => {
        console.log(`>>> Mocked execSync called with: ${command} <<<`);

        return '';
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

  test('should throw error when no package was specifed', async () => {
    let result = addPackages(argsToContext({}));
    expect(result).rejects.toThrow('At least one package must be specified for the "addPackages" step');

    result = addPackages(argsToContext({ dependencies: [] }));
    expect(result).rejects.toThrow('At least one package must be specified for the "addPackages" step');

    result = addPackages(argsToContext({ devDependencies: [] }));
    expect(result).rejects.toThrow('At least one package must be specified for the "addPackages" step');
  });
});
