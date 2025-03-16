import { mockModule } from '@/testHelpers/mockModule';
import { describe, expect, mock, test } from 'bun:test';

describe('mockModule', () => {
  test('should replace module exports with mock implementation', async () => {
    const testModulePath = 'fs';

    const originalModule = await import(testModulePath);

    const mockExistsSyncFn = mock();
    const cleanMock = await mockModule(testModulePath, () => ({
      existsSync: mockExistsSyncFn,
    }));

    const mockedModule = await import(testModulePath);
    expect(mockedModule.existsSync).toBe(mockExistsSyncFn);
    expect(mockedModule.exists).toBe(originalModule.exists);

    cleanMock();

    const restoredModule = await import(testModulePath);
    expect(restoredModule).toBe(originalModule);
    expect(mockedModule.existsSync).toBe(originalModule.existsSync);
    expect(mockedModule.exists).toBe(originalModule.exists);
  });

  test('should throw error for non-existent module', async () => {
    expect(mockModule('./non-existent-module.ts', () => ({}))).rejects.toThrow();
  });
});
