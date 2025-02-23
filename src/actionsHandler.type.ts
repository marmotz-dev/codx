import { Action } from '@/actions/action.type';
import { ConsoleActions } from '@/actions/console/console.const';
import { FS_COPY_NAME } from '@/actions/fs/fs.const';
import { PACKAGES_INSTALL_NAME } from '@/actions/packages/install.const';

export type ActionsHandler = {
  [key in ActionNames]: Action<any>;
};

export type ActionNames = keyof typeof ConsoleActions | typeof FS_COPY_NAME | typeof PACKAGES_INSTALL_NAME;
