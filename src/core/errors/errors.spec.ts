import { CannotSetInternalVariableCodxError } from '@/core/errors/CannotSetInternalVariableCodxError';
import { CannotSetInternalVariableWithInvalidNameCodxError } from '@/core/errors/CannotSetInternalVariableWithInvalidNameCodxError';
import { CannotUnsetInternalVariableCodxError } from '@/core/errors/CannotUnsetInternalVariableCodxError';
import { CannotUnsetInternalVariableWithInvalidNameCodxError } from '@/core/errors/CannotUnsetInternalVariableWithInvalidNameCodxError';
import { CommandCancelledCodxError } from '@/core/errors/CommandCancelledCodxError';
import { CommandExecutionCodxError } from '@/core/errors/CommandExecutionCodxError';
import { DependencyNotFoundCodxError } from '@/core/errors/DependencyNotFoundCodxError';
import { DestinationFileAlreadyExistsCodxError } from '@/core/errors/DestinationFileAlreadyExistsCodxError';
import { DirectoryChangeCodxError } from '@/core/errors/DirectoryChangeCodxError';
import { DirectoryCreationCodxError } from '@/core/errors/DirectoryCreationCodxError';
import { DirectoryNotFoundCodxError } from '@/core/errors/DirectoryNotFoundCodxError';
import { DownloadFailedCodxError } from '@/core/errors/DownloadFailedCodxError';
import { EmptyPackageCodxError } from '@/core/errors/EmptyPackageCodxError';
import { EmptyPackageListCodxError } from '@/core/errors/EmptyPackageListCodxError';
import { ExplicitFailureCodxError } from '@/core/errors/ExplicitFailureCodxError';
import { FetchFailedCodxError } from '@/core/errors/FetchFailedCodxError';
import { FileAlreadyExistsCodxError } from '@/core/errors/FileAlreadyExistsCodxError';
import { FileNotFoundCodxError } from '@/core/errors/FileNotFoundCodxError';
import { FileUnreadableCodxError } from '@/core/errors/FileUnreadableCodxError';
import { HttpErrorCodxError } from '@/core/errors/HttpErrorCodxError';
import { InstantiationFailedCodxError } from '@/core/errors/InstantiationFailedCodxError';
import { InvalidRegexPatternCodxError } from '@/core/errors/InvalidRegexPatternCodxError';
import { MissingContentCodxError } from '@/core/errors/MissingContentCodxError';
import { MissingDestinationPathCodxError } from '@/core/errors/MissingDestinationPathCodxError';
import { MissingDirectoryPathCodxError } from '@/core/errors/MissingDirectoryPathCodxError';
import { MissingMessageCodxError } from '@/core/errors/MissingMessageCodxError';
import { MissingParameterCodxError } from '@/core/errors/MissingParameterCodxError';
import { MissingSourcePathCodxError } from '@/core/errors/MissingSourcePathCodxError';
import { NoPackagesFoundCodxError } from '@/core/errors/NoPackagesFoundCodxError';
import { NotADirectoryCodxError } from '@/core/errors/NotADirectoryCodxError';
import { NpmSearchFailedCodxError } from '@/core/errors/NpmSearchFailedCodxError';
import { PackageManagerNotFoundCodxError } from '@/core/errors/PackageManagerNotFoundCodxError';
import { PathOutsideWorkingDirectoryCodxError } from '@/core/errors/PathOutsideWorkingDirectoryCodxError';
import { RecipeFindFailedCodxError } from '@/core/errors/RecipeFindFailedCodxError';
import { RecipeLoadFailedCodxError } from '@/core/errors/RecipeLoadFailedCodxError';
import { SourceFileNotFoundCodxError } from '@/core/errors/SourceFileNotFoundCodxError';
import { TarballExtractionFailedCodxError } from '@/core/errors/TarballExtractionFailedCodxError';
import { TarballUrlFetchFailedCodxError } from '@/core/errors/TarballUrlFetchFailedCodxError';
import { UnknownActionCodxError } from '@/core/errors/UnknownActionCodxError';
import { UnknownOperationCodxError } from '@/core/errors/UnknownOperationCodxError';
import { describe, expect, test } from 'bun:test';

describe('CodxError classes', () => {
  describe('CannotSetInternalVariableCodxError', () => {
    test('should have correct name and message', () => {
      const name = '$internal';
      const error = new CannotSetInternalVariableCodxError(name);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Cannot set internal variable "${name}"`);
    });
  });

  describe('CannotSetInternalVariableWithInvalidNameCodxError', () => {
    test('should have correct name and message', () => {
      const name = 'internal';
      const error = new CannotSetInternalVariableWithInvalidNameCodxError(name);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Cannot set an internal variable "${name}" that does not start with a $`);
    });
  });

  describe('CannotUnsetInternalVariableCodxError', () => {
    test('should have correct name and message', () => {
      const name = '$internal';
      const error = new CannotUnsetInternalVariableCodxError(name);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Cannot unset internal variable "${name}"`);
    });
  });

  describe('CannotUnsetInternalVariableWithInvalidNameCodxError', () => {
    test('should have correct name and message', () => {
      const name = 'internal';
      const error = new CannotUnsetInternalVariableWithInvalidNameCodxError(name);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Cannot unset an internal variable "${name}" that does not start with a $`);
    });
  });

  describe('CommandCancelledCodxError', () => {
    test('should have correct name and message', () => {
      const error = new CommandCancelledCodxError();
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Command execution cancelled by user.');
    });
  });

  describe('CommandExecutionCodxError', () => {
    test('should have correct name and message', () => {
      const errorObj = new Error('Test error message');
      const error = new CommandExecutionCodxError(errorObj);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Error executing command: Test error message');
    });
  });

  describe('DependencyNotFoundCodxError', () => {
    test('should have correct name and message', () => {
      const token = 'TestToken';
      const error = new DependencyNotFoundCodxError(token);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Dependency not found for the token: ${token}`);
    });
  });

  describe('DestinationFileAlreadyExistsCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new DestinationFileAlreadyExistsCodxError(path);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(
        `Destination file "${path}" already exists and the "overwrite" option is not enabled.`,
      );
    });
  });

  describe('DirectoryChangeCodxError', () => {
    test('should have correct name and message', () => {
      const errorObj = new Error('/test/path');
      const error = new DirectoryChangeCodxError(errorObj);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Error changing directory: /test/path');
    });
  });

  describe('DirectoryCreationCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new DirectoryCreationCodxError(path, new Error('Permission denied'));
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Unable to create directory "${path}": Permission denied`);
    });
  });

  describe('DirectoryNotFoundCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/directory';
      const error = new DirectoryNotFoundCodxError(path);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Directory "${path}" does not exist`);
    });
  });

  describe('DownloadFailedCodxError', () => {
    test('should have correct name and message', () => {
      const url = 'https://example.com/test.tgz';
      const errorObj = new Error('Network error');
      const error = new DownloadFailedCodxError(url, errorObj);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Failed to download ${url}: Network error`);
    });
  });

  describe('EmptyPackageCodxError', () => {
    test('should have correct name and message', () => {
      const error = new EmptyPackageCodxError();
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Package is empty.');
    });
  });

  describe('EmptyPackageListCodxError', () => {
    test('should have correct name and message', () => {
      const error = new EmptyPackageListCodxError();
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Package list is empty or invalid.');
    });
  });

  describe('ExplicitFailureCodxError', () => {
    test('should have correct name and message', () => {
      const message = 'Test failure message';
      const error = new ExplicitFailureCodxError(message);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(message);
    });
  });

  describe('FetchFailedCodxError', () => {
    test('should have correct name and message', () => {
      const url = 'https://example.com/api';
      const status = 500;
      const statusText = 'Internal Server Error';
      const error = new FetchFailedCodxError(url, status, statusText);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Failed to fetch ${url}: ${status} ${statusText}`);
    });
  });

  describe('FileAlreadyExistsCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new FileAlreadyExistsCodxError(path);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`File "${path}" already exists and the "overwrite" option is not enabled.`);
    });
  });

  describe('FileNotFoundCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new FileNotFoundCodxError(path);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`File "${path}" does not exist.`);
    });
  });

  describe('FileUnreadableCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const errorObj = new Error('Permission denied');
      const error = new FileUnreadableCodxError(path, errorObj);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Error reading ${path}: Permission denied`);
    });
  });

  describe('HttpErrorCodxError', () => {
    test('should have correct name and message', () => {
      const status = 404;
      const statusText = 'Not Found';
      const error = new HttpErrorCodxError(status, statusText);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`HTTP Error: ${status} ${statusText}`);
    });
  });

  describe('InstantiationFailedCodxError', () => {
    test('should have correct name and message', () => {
      const className = 'TestClass';
      const errorObj = new Error('Missing dependency');
      const error = new InstantiationFailedCodxError(className, errorObj);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Unable to instanciate ${className}: Missing dependency`);
    });
  });

  describe('InvalidRegexPatternCodxError', () => {
    test('should have correct name and message', () => {
      const pattern = '[invalid';
      const errorObj = new Error('Unterminated character class');
      const error = new InvalidRegexPatternCodxError(pattern, errorObj);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Invalid regular expression pattern "${pattern}": Unterminated character class`);
    });
  });

  describe('MissingContentCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingContentCodxError();
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Content is required for this action');
    });
  });

  describe('MissingDestinationPathCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingDestinationPathCodxError();
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Destination path is required for this action');
    });
  });

  describe('MissingDirectoryPathCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingDirectoryPathCodxError();
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Directory path is required for this action');
    });
  });

  describe('MissingMessageCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingMessageCodxError();
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Message is required for this action');
    });
  });

  describe('MissingParameterCodxError', () => {
    test('should have correct name and message', () => {
      const paramName = 'testParam';
      const error = new MissingParameterCodxError(paramName);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`TestParam is required for this action`);
    });
  });

  describe('MissingSourcePathCodxError', () => {
    test('should have correct name and message', () => {
      const error = new MissingSourcePathCodxError();
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Source path is required for this action');
    });
  });

  describe('NoPackagesFoundCodxError', () => {
    test('should have correct name and message', () => {
      const searchTerm = 'test-package';
      const error = new NoPackagesFoundCodxError(searchTerm);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`No packages found matching "${searchTerm}"`);
    });
  });

  describe('NotADirectoryCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/file.txt';
      const error = new NotADirectoryCodxError(path);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`"${path}" is not a directory`);
    });
  });

  describe('NpmSearchFailedCodxError', () => {
    test('should have correct name and message', () => {
      const status = 500;
      const statusText = 'Internal Server Error';
      const error = new NpmSearchFailedCodxError(status, statusText);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Failed to search npm packages: ${status} ${statusText}`);
    });
  });

  describe('PackageManagerNotFoundCodxError', () => {
    test('should have correct name and message', () => {
      const error = new PackageManagerNotFoundCodxError();
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Package manager not found.');
    });
  });

  describe('PathOutsideWorkingDirectoryCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path/recipe.yml';
      const error = new PathOutsideWorkingDirectoryCodxError(path);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Path "${path}" is outside of the current working directory.`);
    });
  });

  describe('RecipeFindFailedCodxError', () => {
    test('should have correct name and message', () => {
      const errorObj = new Error('Path not found');
      const error = new RecipeFindFailedCodxError(errorObj);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Failed to find recipe: Path not found');
    });
  });

  describe('RecipeLoadFailedCodxError', () => {
    test('should have correct name and message', () => {
      const errorObj = new Error('Invalid YAML');
      const error = new RecipeLoadFailedCodxError(errorObj);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Failed to load recipe: Invalid YAML');
    });
  });

  describe('SourceFileNotFoundCodxError', () => {
    test('should have correct name and message', () => {
      const path = '/test/path';
      const error = new SourceFileNotFoundCodxError(path);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Source file "${path}" does not exist.`);
    });
  });

  describe('TarballExtractionFailedCodxError', () => {
    test('should have correct name and message', () => {
      const errorObj = new Error('Invalid tarball');
      const error = new TarballExtractionFailedCodxError(errorObj);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe('Failed to extract tarball: Invalid tarball');
    });
  });

  describe('TarballUrlFetchFailedCodxError', () => {
    test('should have correct name and message', () => {
      const packageName = 'test-package';
      const version = '1.0.0';
      const error = new TarballUrlFetchFailedCodxError(packageName, version);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Failed to get tarball URL for ${packageName}@${version}`);
    });
  });

  describe('UnknownActionCodxError', () => {
    test('should have correct name and message', () => {
      const actionType = 'testAction';
      const error = new UnknownActionCodxError(actionType);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Unknown action: ${actionType}`);
    });
  });

  describe('UnknownOperationCodxError', () => {
    test('should have correct name and message', () => {
      const operation = 'testOperation';
      const error = new UnknownOperationCodxError(operation);
      expect(error.name).toBe(error.constructor.name);
      expect(error.message).toBe(`Unknown operation: ${operation}`);
    });
  });
});
