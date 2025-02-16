export type CopyFilesArgs = {
  from: string;
  to: string;
}[];

export const COPY_FILES_NAME = 'copyFiles';

export type CopyFilesStep = {
  [COPY_FILES_NAME]: CopyFilesArgs;
};
