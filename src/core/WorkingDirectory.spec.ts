import { WorkingDirectory } from '@/core/WorkingDirectory';
import { MockCleaner, mockModule } from '@/testHelpers/mockModule';
import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { existsSync } from 'fs';
import { join } from 'node:path';

describe('WorkingDirectory', () => {
  let originalProcessCwd: () => string;
  let originalWorkingDir: string;
  let mockFsCleaner: MockCleaner;

  const mockWorkingDir = '/mock/working/dir';

  beforeEach(async () => {
    // Save original process.cwd and mock fs methods
    originalProcessCwd = process.cwd;
    originalWorkingDir = process.cwd();

    // Mock process.cwd to return our temp directory
    process.cwd = () => mockWorkingDir;

    mockFsCleaner = await mockModule('fs', () => ({
      existsSync: mock().mockReturnValue(true),
      statSync: mock().mockReturnValue({ isDirectory: () => true }),
    }));
  });

  afterEach(async () => {
    // Restore original process.cwd
    process.cwd = originalProcessCwd;
    process.chdir(originalWorkingDir);

    mockFsCleaner();
  });

  describe('constructor', () => {
    test('should initialize with default current working directory', () => {
      const workingDirectory = new WorkingDirectory();
      expect(workingDirectory.get()).toBe(mockWorkingDir);
    });

    test('should initialize with provided directory', () => {
      const workingDirectory = new WorkingDirectory(mockWorkingDir);
      expect(workingDirectory.get()).toBe(mockWorkingDir);
    });

    test('should throw error for non-existent directory', () => {
      (existsSync as any).mockReturnValue(false);

      const nonExistentPath = join(mockWorkingDir, 'non-existent-dir');
      expect(() => new WorkingDirectory(nonExistentPath)).toThrow(`Directory "${nonExistentPath}" does not exist`);
    });
  });

  describe('resolve method', () => {
    test('should resolve relative path to absolute path', () => {
      const workingDirectory = new WorkingDirectory(mockWorkingDir);
      const relativePath = 'some/relative/path';

      const resolvedPath = workingDirectory.resolve(relativePath);
      expect(resolvedPath).toBe(join(mockWorkingDir, relativePath));
    });
  });
});
