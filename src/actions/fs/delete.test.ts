import { createActionContext } from '@/test-helpers/actionContext';
import { MockCleaner, mockModule } from '@/test-helpers/mockModule';
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test';
import { rm } from 'fs/promises';
import { resolve } from 'path';
import { fsDeleteAction } from './delete';

const mockLogger = {
  success: jest.fn(),
  error: jest.fn(),
};

describe('fsDeleteAction', () => {
  let cleanFsMock: MockCleaner;
  let cleanPathMock: MockCleaner;
  let cleanLoggerMock: MockCleaner;

  beforeEach(async () => {
    cleanFsMock = await mockModule('fs/promises', () => ({
      rm: jest.fn(),
    }));

    cleanPathMock = await mockModule('path', () => ({
      resolve: jest.fn().mockImplementation((...args) => args.join('/')),
    }));

    cleanLoggerMock = await mockModule('@/services/logger', () => ({
      loggerService: mockLogger,
    }));
  });

  afterEach(() => {
    cleanFsMock();
    cleanPathMock();
    cleanLoggerMock();
  });

  it('should delete a single file and log success', async () => {
    const args = { args: 'file.txt', projectDirectory: '/project' };
    (rm as jest.Mock).mockResolvedValueOnce(undefined);

    await fsDeleteAction(createActionContext(args));

    expect(resolve).toHaveBeenCalledWith(args.projectDirectory, 'file.txt');
    expect(rm).toHaveBeenCalledWith('/project/file.txt');
    expect(mockLogger.success).toHaveBeenCalledWith('/project/file.txt has been deleted');
  });

  it('should delete multiple files and log success for each', async () => {
    const args = { args: ['file1.txt', 'file2.txt'], projectDirectory: '/project' };
    (rm as jest.Mock).mockResolvedValue(undefined);

    await fsDeleteAction(createActionContext(args));

    expect(resolve).toHaveBeenCalledWith(args.projectDirectory, 'file1.txt');
    expect(resolve).toHaveBeenCalledWith(args.projectDirectory, 'file2.txt');
    expect(rm).toHaveBeenCalledWith('/project/file1.txt');
    expect(rm).toHaveBeenCalledWith('/project/file2.txt');
    expect(mockLogger.success).toHaveBeenCalledWith('/project/file1.txt has been deleted');
    expect(mockLogger.success).toHaveBeenCalledWith('/project/file2.txt has been deleted');
  });

  it('should throw an error if no files or directories are provided', async () => {
    const args = { args: [], projectDirectory: '/project' };

    expect(fsDeleteAction(createActionContext(args))).rejects.toThrow(
      'At least one file or directory must be specified for the "delete" action',
    );
  });

  it('should log an error and rethrow if deletion fails', async () => {
    const args = { args: 'file.txt', projectDirectory: '/project' };
    const error = new Error('Deletion failed');
    (rm as jest.Mock).mockRejectedValueOnce(error);

    expect(fsDeleteAction(createActionContext(args))).rejects.toThrow(error);

    expect(resolve).toHaveBeenCalledWith(args.projectDirectory, 'file.txt');
    expect(rm).toHaveBeenCalledWith('/project/file.txt');
    expect(mockLogger.error).toHaveBeenCalledWith('Failed to delete "file.txt"');
  });
});
