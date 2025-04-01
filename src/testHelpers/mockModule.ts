import { mock } from 'bun:test';

export type MockCleaner = () => void;

export const mockModule = async (
  modulePath: string,
  mockImplementation: () => Record<string, unknown>,
): Promise<MockCleaner> => {
  let original = {
    ...(await import(modulePath)),
  };

  await mock.module(modulePath, () => ({
    ...original,
    ...mockImplementation(),
  }));

  return () => {
    mock.module(modulePath, () => original);
  };
};
