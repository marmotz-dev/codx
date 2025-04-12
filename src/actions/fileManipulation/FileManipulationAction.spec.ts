import { FileManipulationAction } from '@/actions/fileManipulation/FileManipulationAction';
import {
  FileManipulationActionAppendData,
  FileManipulationActionCreateData,
  FileManipulationActionData,
  FileManipulationActionPrependData,
  FileManipulationActionUpdateData,
} from '@/actions/fileManipulation/FileManipulationAction.schema';
import { CodxError } from '@/core/CodxError';
import { Store } from '@/core/Store';
import { diContainer } from '@/di/Container';
import { MockCleaner, mockModule } from '@/testHelpers/mockModule';
import { setupConsole } from '@/testHelpers/setupConsole';
import { setupWorkingDirectories } from '@/testHelpers/setupWorkingDirectories';
import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

describe('FileManipulationAction', () => {
  const { mockProjectDir } = setupWorkingDirectories();
  setupConsole();

  const mockFilePath = 'test/file.txt';
  const mockAbsolutePath = `${mockProjectDir}/${mockFilePath}`;
  const mockContent = 'Test content';
  const mockInterpolatedContent = 'Interpolated test content';
  const mockPrependContent = 'Prepend content';
  const mockInterpolatedPrependContent = 'Interpolated prepend content';
  const mockAppendContent = 'Append content';
  const mockInterpolatedAppendContent = 'Interpolated append content';
  const mockExistingContent = 'Existing content';
  const mockPattern = 'Existing';
  const mockInterpolatedPattern = 'Existing';
  const mockUpdateContent = 'Updated';
  const mockInterpolatedUpdateContent = 'Updated';

  // Regex test content and patterns
  const mockRegexContent = 'This is a test string with multiple words. This is a second sentence.';
  const mockRegexSpecialCharsPattern = 'a .* with';
  const mockRegexCaptureGroupPattern = '(This) is';
  const mockRegexCaptureGroupReplacement = 'That was';
  const mockRegexMultipleMatchesPattern = 'This';
  const mockRegexMultipleMatchesReplacement = 'That';
  const mockRegexLineStartPattern = '^This';
  const mockRegexLineEndPattern = 'sentence\\.$';
  const mockComplexRegexPattern = '(\\w+) is a (\\w+)';
  const mockComplexRegexReplacement = '$2 was my $1';

  let mockFsCleaner: MockCleaner;
  let action: FileManipulationAction;

  beforeEach(async () => {
    mockFsCleaner = await mockModule('fs', () => ({
      existsSync: mock(),
      writeFileSync: mock(),
      readFileSync: mock(),
      mkdirSync: mock(),
    }));

    const mockStore = diContainer.get(Store);
    spyOn(mockStore, 'interpolate').mockImplementation((value) => {
      if (value === mockContent) {
        return mockInterpolatedContent;
      }
      if (value === mockPrependContent) {
        return mockInterpolatedPrependContent;
      }
      if (value === mockAppendContent) {
        return mockInterpolatedAppendContent;
      }
      if (value === mockPattern) {
        return mockInterpolatedPattern;
      }
      if (value === mockUpdateContent) {
        return mockInterpolatedUpdateContent;
      }
      if (value === mockRegexCaptureGroupPattern) {
        return mockRegexCaptureGroupPattern;
      }
      if (value === mockRegexCaptureGroupReplacement) {
        return mockRegexCaptureGroupReplacement;
      }
      if (value === mockRegexSpecialCharsPattern) {
        return mockRegexSpecialCharsPattern;
      }
      if (value === mockRegexMultipleMatchesPattern) {
        return mockRegexMultipleMatchesPattern;
      }
      if (value === mockRegexMultipleMatchesReplacement) {
        return mockRegexMultipleMatchesReplacement;
      }
      if (value === mockRegexLineStartPattern) {
        return mockRegexLineStartPattern;
      }
      if (value === mockRegexLineEndPattern) {
        return mockRegexLineEndPattern;
      }
      if (value === mockComplexRegexPattern) {
        return mockComplexRegexPattern;
      }
      if (value === mockComplexRegexReplacement) {
        return mockComplexRegexReplacement;
      }

      return value;
    });

    // Reset fs mocks
    (existsSync as any).mockReset();
    (writeFileSync as any).mockReset();
    (readFileSync as any).mockReset();
    (mkdirSync as any).mockReset();

    action = diContainer.get(FileManipulationAction);
  });

  afterEach(() => {
    mockFsCleaner();
    mock.restore();
  });

  describe('Operation CREATE', () => {
    test('should create a file with content', async () => {
      // Mock file does not exist
      (existsSync as any).mockReturnValue(false);

      const actionData = {
        type: 'fileManipulation',
        operation: 'create',
        path: mockFilePath,
        content: mockContent,
      } as FileManipulationActionCreateData;

      await action.execute(actionData);

      expect(writeFileSync).toHaveBeenCalledWith(mockAbsolutePath, mockInterpolatedContent);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('File created successfully'));
    });

    test('should throw error when file exists and overwrite option is not enabled', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileManipulation',
        operation: 'create',
        path: mockFilePath,
        content: mockContent,
      } as FileManipulationActionData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('already exists and the "overwrite" option is not enabled');
    });

    test('should create a file with content when file exists and overwrite option is enabled', async () => {
      (existsSync as any).mockReturnValue(true);

      const actionData = {
        type: 'fileManipulation',
        operation: 'create',
        path: mockFilePath,
        content: mockContent,
        overwrite: true,
      } as FileManipulationActionData;

      await action.execute(actionData);

      expect(writeFileSync).toHaveBeenCalledWith(mockAbsolutePath, mockInterpolatedContent);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('File created successfully'));
    });
  });

  describe('Operation PREPEND', () => {
    test('should prepend content to a file', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockExistingContent);

      const actionData = {
        type: 'fileManipulation',
        operation: 'prepend',
        path: mockFilePath,
        content: mockPrependContent,
      } as FileManipulationActionPrependData;

      await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).toHaveBeenCalledWith(
        mockAbsolutePath,
        mockInterpolatedPrependContent + mockExistingContent,
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Content prepended successfully'));
    });

    test('should throw error when file does not exist', async () => {
      (existsSync as any).mockReturnValue(false);

      const actionData = {
        type: 'fileManipulation',
        operation: 'prepend',
        path: mockFilePath,
        content: mockPrependContent,
      } as FileManipulationActionPrependData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('does not exist');
    });
  });

  describe('Operation APPEND', () => {
    test('should append content to a file', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockExistingContent);

      const actionData = {
        type: 'fileManipulation',
        operation: 'append',
        path: mockFilePath,
        content: mockAppendContent,
      } as FileManipulationActionAppendData;

      await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).toHaveBeenCalledWith(mockAbsolutePath, mockExistingContent + mockInterpolatedAppendContent);
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Content appended successfully'));
    });

    test('should throw error when file does not exist', async () => {
      (existsSync as any).mockReturnValue(false);

      const actionData = {
        type: 'fileManipulation',
        operation: 'append',
        path: mockFilePath,
        content: mockAppendContent,
      } as FileManipulationActionAppendData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('does not exist');
    });
  });

  describe('Operation UPDATE', () => {
    test('should update content in a file using a regex pattern', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockExistingContent);

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockPattern,
        content: mockUpdateContent,
      } as FileManipulationActionUpdateData;

      await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).toHaveBeenCalledWith(
        mockAbsolutePath,
        mockExistingContent.replace(new RegExp(mockInterpolatedPattern, 'g'), mockInterpolatedUpdateContent),
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Content updated successfully'));
    });

    test('should throw error when file does not exist', async () => {
      (existsSync as any).mockReturnValue(false);

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockPattern,
        content: mockUpdateContent,
      } as FileManipulationActionUpdateData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('does not exist');
    });

    test('should log warning when pattern is not found', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue('Content without pattern');

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockPattern,
        content: mockUpdateContent,
      } as FileManipulationActionUpdateData;

      const result = await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Pattern'));
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('not found'));
      expect(result).toEqual({
        path: mockAbsolutePath,
        updated: false,
      });
    });

    test('should throw error when pattern is invalid', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockExistingContent);

      // Mock RegExp to throw an error
      const originalRegExp = global.RegExp;
      global.RegExp = function () {
        throw new Error('Invalid regex');
      } as any;

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockPattern,
        content: mockUpdateContent,
      } as FileManipulationActionUpdateData;

      expect(action.execute(actionData)).rejects.toThrow(CodxError);
      expect(action.execute(actionData)).rejects.toThrow('Invalid regular expression pattern');

      // Restore original RegExp
      global.RegExp = originalRegExp;
    });

    test('should update content using regex with special characters', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockRegexContent);

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockRegexSpecialCharsPattern,
        content: 'a TEST with',
      } as FileManipulationActionUpdateData;

      await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).toHaveBeenCalledWith(
        mockAbsolutePath,
        'This is a TEST with multiple words. This is a second sentence.',
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Content updated successfully'));
    });

    test('should update content using regex with capture groups', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockRegexContent);

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockRegexCaptureGroupPattern,
        content: mockRegexCaptureGroupReplacement,
      } as FileManipulationActionUpdateData;

      await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).toHaveBeenCalledWith(
        mockAbsolutePath,
        'That was a test string with multiple words. That was a second sentence.',
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Content updated successfully'));
    });

    test('should update content with multiple matches', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockRegexContent);

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockRegexMultipleMatchesPattern,
        content: mockRegexMultipleMatchesReplacement,
      } as FileManipulationActionUpdateData;

      await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).toHaveBeenCalledWith(
        mockAbsolutePath,
        'That is a test string with multiple words. That is a second sentence.',
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Content updated successfully'));
    });

    test('should update content using regex with line start anchor', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockRegexContent);

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockRegexLineStartPattern,
        content: 'That',
      } as FileManipulationActionUpdateData;

      await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).toHaveBeenCalledWith(
        mockAbsolutePath,
        'That is a test string with multiple words. This is a second sentence.',
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Content updated successfully'));
    });

    test('should update content using regex with line end anchor', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockRegexContent);

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockRegexLineEndPattern,
        content: 'paragraph.',
      } as FileManipulationActionUpdateData;

      await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).toHaveBeenCalledWith(
        mockAbsolutePath,
        'This is a test string with multiple words. This is a second paragraph.',
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Content updated successfully'));
    });

    test('should update content using complex regex with capture groups and backreferences', async () => {
      // Mock file exists
      (existsSync as any).mockReturnValue(true);
      (readFileSync as any).mockReturnValue(mockRegexContent);

      const actionData = {
        type: 'fileManipulation',
        operation: 'update',
        path: mockFilePath,
        pattern: mockComplexRegexPattern,
        content: mockComplexRegexReplacement,
      } as FileManipulationActionUpdateData;

      await action.execute(actionData);

      expect(readFileSync).toHaveBeenCalledWith(mockAbsolutePath, 'utf8');
      expect(writeFileSync).toHaveBeenCalledWith(
        mockAbsolutePath,
        'test was my This string with multiple words. second was my This sentence.',
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Content updated successfully'));
    });
  });

  test('should throw error for unrecognized operation', async () => {
    const actionData = {
      type: 'fileManipulation',
      operation: 'invalid' as any,
      path: mockFilePath,
    } as FileManipulationActionData;

    expect(action.execute(actionData)).rejects.toThrow(CodxError);
    expect(action.execute(actionData)).rejects.toThrow('Unrecognized file manipulation operation: invalid');
  });
});
