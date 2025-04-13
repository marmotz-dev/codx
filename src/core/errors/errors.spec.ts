import { CommandCancelledCodxError } from '@/core/errors/CommandCancelledCodxError';
import { CommandExecutionCodxError } from '@/core/errors/CommandExecutionCodxError';
import { DestinationFileAlreadyExistsCodxError } from '@/core/errors/DestinationFileAlreadyExistsCodxError';
import { DirectoryChangeCodxError } from '@/core/errors/DirectoryChangeCodxError';
import { DirectoryCreationCodxError } from '@/core/errors/DirectoryCreationCodxError';
import { EmptyPackageCodxError } from '@/core/errors/EmptyPackageCodxError';
import { EmptyPackageListCodxError } from '@/core/errors/EmptyPackageListCodxError';
import { ExplicitFailureCodxError } from '@/core/errors/ExplicitFailureCodxError';
import { FileAlreadyExistsCodxError } from '@/core/errors/FileAlreadyExistsCodxError';
import { FileNotFoundCodxError } from '@/core/errors/FileNotFoundCodxError';
import { FileUnreadableCodxError } from '@/core/errors/FileUnreadableCodxError';
import { InvalidRegexPatternCodxError } from '@/core/errors/InvalidRegexPatternCodxError';
import { MissingContentCodxError } from '@/core/errors/MissingContentCodxError';
import { MissingDestinationPathCodxError } from '@/core/errors/MissingDestinationPathCodxError';
import { MissingDirectoryPathCodxError } from '@/core/errors/MissingDirectoryPathCodxError';
import { MissingMessageCodxError } from '@/core/errors/MissingMessageCodxError';
import { MissingParameterCodxError } from '@/core/errors/MissingParameterCodxError';
import { MissingSourcePathCodxError } from '@/core/errors/MissingSourcePathCodxError';
import { OutsideSourceFileCodxError } from '@/core/errors/OutsideSourceFileCodxError';
import { PackageManagerNotFoundCodxError } from '@/core/errors/PackageManagerNotFoundCodxError';
import { SourceFileNotFoundCodxError } from '@/core/errors/SourceFileNotFoundCodxError';
import { UnknownActionCodxError } from '@/core/errors/UnknownActionCodxError';
import { UnknownOperationCodxError } from '@/core/errors/UnknownOperationCodxError';
import { describe, expect, test } from 'bun:test';

describe('CodxError classes', () => {
  describe('CommandCancelledCodxError', () => {
    test('should have correct name and message', () => {
      const error = new CommandCancelledCodxError();
      expect(error.name).toBe('CommandCancelledCodxError');
      expect(error.message).toBe('Command execution cancelled by user.');
    });
  });

  describe('CommandExecutionCodxError', () => {
    test('should have correct name and message', () => {
      const errorObj = new Error('Test error message');
      const error = new CommandExecutionCodxError(errorObj);
      expect(error.name).toBe('CommandExecutionCodxError');
      expect(error.message).toBe('Error executing command: Test error message');
    });
  });

  describe('DestinationFileAlreadyExistsCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new DestinationFileAlreadyExistsCodxError(path);
      expect(error.name).toBe('DestinationFileAlreadyExistsCodxError');
      expect(error.message).toBe(
        `Destination file "${path}" already exists and the "overwrite" option is not enabled.`,
      );
    });
  });

  describe('DirectoryChangeCodxError', () => {
    test('should have correct name and message', () => {
      const errorObj = new Error('/test/path');
      const error = new DirectoryChangeCodxError(errorObj);
      expect(error.name).toBe('DirectoryChangeCodxError');
      expect(error.message).toBe('Error changing directory: /test/path');
    });
  });

  describe('DirectoryCreationCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new DirectoryCreationCodxError(path, new Error('Permission denied'));
      expect(error.name).toBe('DirectoryCreationCodxError');
      expect(error.message).toBe(`Unable to create directory "${path}": Permission denied`);
    });
  });

  describe('EmptyPackageCodxError', () => {
    test('should have correct name and message', () => {
      const error = new EmptyPackageCodxError();
      expect(error.name).toBe('EmptyPackageCodxError');
      expect(error.message).toBe('Package is empty.');
    });
  });

  describe('EmptyPackageListCodxError', () => {
    test('should have correct name and message', () => {
      const error = new EmptyPackageListCodxError();
      expect(error.name).toBe('EmptyPackageListCodxError');
      expect(error.message).toBe('Package list is empty or invalid.');
    });
  });

  describe('ExplicitFailureCodxError', () => {
    test('should have correct name and message', () => {
      const message = 'Test failure message';
      const error = new ExplicitFailureCodxError(message);
      expect(error.name).toBe('ExplicitFailureCodxError');
      expect(error.message).toBe(message);
    });
  });

  describe('FileAlreadyExistsCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new FileAlreadyExistsCodxError(path);
      expect(error.name).toBe('FileAlreadyExistsCodxError');
      expect(error.message).toBe(`File "${path}" already exists and the "overwrite" option is not enabled.`);
    });
  });

  describe('FileNotFoundCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new FileNotFoundCodxError(path);
      expect(error.name).toBe('FileNotFoundCodxError');
      expect(error.message).toBe(`File "${path}" does not exist.`);
    });
  });

  describe('FileUnreadableCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const errorObj = new Error('Permission denied');
      const error = new FileUnreadableCodxError(path, errorObj);
      expect(error.name).toBe('FileUnreadableCodxError');
      expect(error.message).toBe(`Error reading ${path}: Permission denied`);
    });
  });

  describe('InvalidRegexPatternCodxError', () => {
    test('should have correct name and message', () => {
      const pattern = '[invalid';
      const errorObj = new Error('Unterminated character class');
      const error = new InvalidRegexPatternCodxError(pattern, errorObj);
      expect(error.name).toBe('InvalidRegexPatternCodxError');
      expect(error.message).toBe(`Invalid regular expression pattern "${pattern}": Unterminated character class`);
    });
  });

  describe('MissingContentCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingContentCodxError();
      expect(error.name).toBe('MissingContentCodxError');
      expect(error.message).toBe('Content is required for this action');
    });
  });

  describe('MissingDestinationPathCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingDestinationPathCodxError();
      expect(error.name).toBe('MissingDestinationPathCodxError');
      expect(error.message).toBe('Destination path is required for this action');
    });
  });

  describe('MissingDirectoryPathCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingDirectoryPathCodxError();
      expect(error.name).toBe('MissingDirectoryPathCodxError');
      expect(error.message).toBe('Directory path is required for this action');
    });
  });

  describe('MissingMessageCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingMessageCodxError();
      expect(error.name).toBe('MissingMessageCodxError');
      expect(error.message).toBe('Message is required for this action');
    });
  });

  describe('MissingParameterCodxError', () => {
    test('should have correct name and message', () => {
      const paramName = 'testParam';
      const error = new MissingParameterCodxError(paramName);
      expect(error.name).toBe('MissingParameterCodxError');
      expect(error.message).toBe(`TestParam is required for this action`);
    });
  });

  describe('MissingSourcePathCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingSourcePathCodxError();
      expect(error.name).toBe('MissingSourcePathCodxError');
      expect(error.message).toBe('Source path is required for this action');
    });
  });

  describe('OutsideSourceFileCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new OutsideSourceFileCodxError(path);
      expect(error.name).toBe('OutsideSourceFileCodxError');
      expect(error.message).toBe(
        `Source file "${path}" is neither in the recipe directory nor in the project directory.`,
      );
    });
  });

  describe('PackageManagerNotFoundCodxError', () => {
    test('should have correct name and message', () => {
      const error = new PackageManagerNotFoundCodxError();
      expect(error.name).toBe('PackageManagerNotFoundCodxError');
      expect(error.message).toBe('Package manager not found.');
    });
  });

  describe('SourceFileNotFoundCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new SourceFileNotFoundCodxError(path);
      expect(error.name).toBe('SourceFileNotFoundCodxError');
      expect(error.message).toBe(`Source file "${path}" does not exist.`);
    });
  });

  describe('UnknownActionCodxError', () => {
    test('should have correct name and message', () => {
      const actionType = 'testAction';
      const error = new UnknownActionCodxError(actionType);
      expect(error.name).toBe('UnknownActionCodxError');
      expect(error.message).toBe(`Unknown action: ${actionType}`);
    });
  });

  describe('UnknownOperationCodxError', () => {
    test('should have correct name and message', () => {
      const operation = 'testOperation';
      const error = new UnknownOperationCodxError(operation);
      expect(error.name).toBe('UnknownOperationCodxError');
      expect(error.message).toBe(`Unknown operation: ${operation}`);
    });
  });
});
