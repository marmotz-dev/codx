import { ChangeDirActionDataSchema } from '@/actions/changeDir/ChangeDirAction.schema';
import { CommandActionDataSchema } from '@/actions/command/CommandAction.schema';
import { FailActionDataSchema } from '@/actions/fail/FailAction.schema';
import { FileManipulationActionDataSchema } from '@/actions/fileManipulation/FileManipulationAction.schema';
import { FileSystemActionDataSchema } from '@/actions/fileSystem/FileSystemAction.schema';
import { MessageActionDataSchema } from '@/actions/message/MessageAction.schema';
import { PackageActionDataSchema } from '@/actions/package/PackageAction.schema';
import { PromptActionDataSchema } from '@/actions/prompt/PromptAction.schema';
import { z } from 'zod';

// Union of all actions
export const ActionsDataSchema = z
  .union([
    ChangeDirActionDataSchema,
    CommandActionDataSchema,
    FailActionDataSchema,
    FileManipulationActionDataSchema,
    FileSystemActionDataSchema,
    MessageActionDataSchema,
    PackageActionDataSchema,
    PromptActionDataSchema,
  ])
  .describe('ActionsDataSchema');

export type ActionsData = z.infer<typeof ActionsDataSchema>;
