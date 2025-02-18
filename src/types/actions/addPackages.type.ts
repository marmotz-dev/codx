export type Package =
  | string
  | {
      name: string;
      exact?: boolean;
    };

export type AddPackagesArgs = {
  dependencies?: Package[];
  devDependencies?: Package[];
};

export const ADD_PACKAGES_NAME = 'addPackages';

export type AddPackagesAction = {
  [ADD_PACKAGES_NAME]: AddPackagesArgs;
};
