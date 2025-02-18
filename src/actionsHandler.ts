import { addPackages } from '@/actions/addPackages';
import { copyFiles } from '@/actions/copyFiles';
import { log } from '@/actions/log';
import { Action } from '@/types/action.type';

export const actionsHandler: Record<string, Action<never>> = {
  addPackages,
  copyFiles,
  log,
};
