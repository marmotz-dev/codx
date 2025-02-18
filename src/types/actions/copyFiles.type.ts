export type CopyFilesArgs = {
  from: string;
  to: string;
}[];

export const COPY_FILES_NAME = 'copyFiles';

export type CopyFilesAction = {
  [COPY_FILES_NAME]: CopyFilesArgs;
};
