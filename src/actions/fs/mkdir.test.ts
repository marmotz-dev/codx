import { createActionContext } from '@/test-helpers/actionContext';
import { MockCleaner, mockModule } from '@/test-helpers/mockModule';
import { afterEach, beforeEach, describe, expect, it, jest } from 'bun:test'; // For mocking
import { mkdir } from 'fs/promises';
import { resolve } from 'path';
import { fsMkdirAction } from './mkdir';

const mockLogger = {
  success: jest.fn(),
  error: jest.fn(),
};

describe('fsMkdirAction', () => {
  const projectDirectory = '/base/project';
  let cleanFsMock: MockCleaner;
  let cleanLoggerMock: MockCleaner;

  beforeEach(async () => {
    cleanFsMock = await mockModule('fs/promises', () => ({
      mkdir: jest.fn().mockResolvedValue(undefined),
    }));

    cleanLoggerMock = await mockModule('@/services/logger', () => ({
      loggerService: mockLogger,
    }));
  });

  afterEach(() => {
    cleanFsMock();
    cleanLoggerMock();
  });

  it('should create a single directory successfully', async () => {
    const args = { args: 'test-dir', projectDirectory };
    (mkdir as jest.Mock).mockResolvedValue(undefined);

    await fsMkdirAction(createActionContext(args));

    const expectedPath = resolve(projectDirectory, 'test-dir');
    expect(mkdir).toHaveBeenCalledWith(expectedPath, { recursive: true });
    expect(mockLogger.success).toHaveBeenCalledWith(`${expectedPath} has been created`);
  });

  it('should create multiple directories successfully', async () => {
    const args = { args: ['dir1', 'dir2'], projectDirectory };
    (mkdir as jest.Mock).mockResolvedValue(undefined);

    await fsMkdirAction(createActionContext(args));

    expect(mkdir).toHaveBeenCalledTimes(2);
    expect(mockLogger.success).toHaveBeenCalledWith(resolve(projectDirectory, 'dir1') + ' has been created');
    expect(mockLogger.success).toHaveBeenCalledWith(resolve(projectDirectory, 'dir2') + ' has been created');
  });

  it('should throw an error when no directories are provided', async () => {
    const args = { args: [], projectDirectory };

    expect(fsMkdirAction(createActionContext(args))).rejects.toThrow(
      'At least one directory must be specified for the "mkdir" action',
    );

    expect(mkdir).not.toHaveBeenCalled();
    expect(mockLogger.error).not.toHaveBeenCalled();
  });

  it('should throw an error and log failure when mkdir fails', async () => {
    const args = { args: 'fail-dir', projectDirectory };
    const error = new Error('mkdir failed');
    (mkdir as jest.Mock).mockRejectedValueOnce(error);

    expect(fsMkdirAction(createActionContext(args))).rejects.toThrow(error);

    const expectedPath = resolve(projectDirectory, 'fail-dir');
    expect(mkdir).toHaveBeenCalledWith(expectedPath, { recursive: true });
    expect(mockLogger.error).toHaveBeenCalledWith('Failed to create "fail-dir" directory');
  });
});
