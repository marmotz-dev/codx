import { ConsoleLogAction } from '@/actions/console/log.type';
import { FsCopyAction } from '@/actions/fs/copy.type';
import { PackagesInstallAction } from '@/actions/packages/install.type';

export type Recipe = {
  recipe: AnyAction[];
};

export type AnyAction = PackagesInstallAction | FsCopyAction | ConsoleLogAction;
