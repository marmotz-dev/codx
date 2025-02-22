import { FS_COPY_NAME } from '@/actions/fs/copy.const';

export type FsCopyArgs = {
  from: string;
  to: string;
}[];

export type FsCopyAction = {
  [FS_COPY_NAME]: FsCopyArgs;
};
