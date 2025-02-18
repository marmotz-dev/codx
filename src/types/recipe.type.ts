import { ADD_PACKAGES_NAME, AddPackagesAction } from '@/types/actions/addPackages.type';
import { COPY_FILES_NAME, CopyFilesAction } from '@/types/actions/copyFiles.type';
import { LOG_NAME, LogAction } from '@/types/actions/log.type';

export type Recipe = {
  recipe: AnyAction[];
};

export type ActionNames = typeof ADD_PACKAGES_NAME | typeof COPY_FILES_NAME | typeof LOG_NAME;
export type AnyAction = AddPackagesAction | CopyFilesAction | LogAction;
