import { ConsoleActions } from '@/actions/console/console.const';
import { fsCopyAction } from '@/actions/fs/copy';
import { FS_COPY_NAME } from '@/actions/fs/copy.const';
import { packagesInstallAction } from '@/actions/packages/install';
import { PACKAGES_INSTALL_NAME } from '@/actions/packages/install.const';
import { ActionsHandler } from '@/actionsHandler.type';

export const actionsHandler: ActionsHandler = {
  ...ConsoleActions,
  [FS_COPY_NAME]: fsCopyAction,
  [PACKAGES_INSTALL_NAME]: packagesInstallAction,
};
