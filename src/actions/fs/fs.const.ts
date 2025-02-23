import { fsCopyAction } from '@/actions/fs/copy';
import { fsDeleteAction } from '@/actions/fs/delete';
import { fsMkdirAction } from '@/actions/fs/mkdir';

export const FS_NAMESPACE = 'fs';

export const FS_COPY_NAME = `${FS_NAMESPACE}.copy`;
export const FS_MKDIR_NAME = `${FS_NAMESPACE}.mkdir`;
export const FS_DELETE_NAME = `${FS_NAMESPACE}.delete`;

export const FsActions = {
  [FS_COPY_NAME]: fsCopyAction,
  [FS_MKDIR_NAME]: fsMkdirAction,
  [FS_DELETE_NAME]: fsDeleteAction,
} as const;
