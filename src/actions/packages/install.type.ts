import { PACKAGES_INSTALL_NAME } from '@/actions/packages/install.const';

export type Package =
  | string
  | {
      name: string;
      exact?: boolean;
    };

export type PackagesInstallArgs = {
  dependencies?: Package[];
  devDependencies?: Package[];
};

export type PackagesInstallAction = {
  [PACKAGES_INSTALL_NAME]: PackagesInstallArgs;
};
