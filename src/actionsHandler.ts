import { ConsoleActions } from '@/actions/console/console.const';
import { FsActions } from '@/actions/fs/fs.const';
import { packagesInstallAction } from '@/actions/packages/install';
import { PACKAGES_INSTALL_NAME } from '@/actions/packages/install.const';
import { ActionsHandler } from '@/actionsHandler.type';

export const actionsHandler: ActionsHandler = {
  ...ConsoleActions,
  ...FsActions,
  [PACKAGES_INSTALL_NAME]: packagesInstallAction,
};
