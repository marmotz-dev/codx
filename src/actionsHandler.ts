import { consoleLogAction } from '@/actions/console/log';
import { CONSOLE_LOG_NAME } from '@/actions/console/log.const';
import { fsCopyAction } from '@/actions/fs/copy';
import { FS_COPY_NAME } from '@/actions/fs/copy.const';
import { packagesInstallAction } from '@/actions/packages/install';
import { PACKAGES_INSTALL_NAME } from '@/actions/packages/install.const';
import { ActionsHandler } from '@/actionsHandler.type';

export const actionsHandler: ActionsHandler = {
  [CONSOLE_LOG_NAME]: consoleLogAction,
  [FS_COPY_NAME]: fsCopyAction,
  [PACKAGES_INSTALL_NAME]: packagesInstallAction,
};
