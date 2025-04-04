import { IAction } from '@/actions/Action.interface';
import { ChangeDirAction } from '@/actions/changeDir/ChangeDirAction';
import { CommandAction } from '@/actions/command/CommandAction';
import { FileSystemAction } from '@/actions/fileSystem/FileSystemAction';
import { MessageAction } from '@/actions/message/MessageAction';
import { PackageAction } from '@/actions/package/PackageAction';
import { PromptAction } from '@/actions/prompt/PromptAction';
import { Constructor } from '@/di/Constructor.type';

export type ActionRegistry = Record<string, Constructor<IAction>>;

export const actionRegistry: ActionRegistry = {
  message: MessageAction,
  prompt: PromptAction,
  command: CommandAction,
  changeDir: ChangeDirAction,
  fileSystem: FileSystemAction,
  package: PackageAction,
};
