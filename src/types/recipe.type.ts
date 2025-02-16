import { ADD_PACKAGES_NAME, AddPackagesStep } from '@/types/steps/addPackages.type';
import { COPY_FILES_NAME, CopyFilesStep } from '@/types/steps/copyFiles.type';
import { LOG_NAME, LogStep } from '@/types/steps/log.type';

export type Recipe = {
  recipe: AnyStep[];
};

export type StepNames = typeof ADD_PACKAGES_NAME | typeof COPY_FILES_NAME | typeof LOG_NAME;
export type AnyStep = AddPackagesStep | CopyFilesStep | LogStep;
