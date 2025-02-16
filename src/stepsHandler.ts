import { addPackages } from '@/steps/addPackages';
import { copyFiles } from '@/steps/copyFiles';
import { log } from '@/steps/log';
import { Step } from '@/types/step.type';

export const stepsHandler: Record<string, Step<never>> = {
  addPackages,
  copyFiles,
  log,
};
