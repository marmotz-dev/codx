import { ChangeDirAction } from '@/actions/changeDir/ChangeDirAction';
import { ChangeDirActionData } from '@/actions/changeDir/ChangeDirAction.schema';
import { CodxError } from '@/core/CodxError';
import { Context } from '@/core/Context';
import { ProjectDirectory } from '@/core/ProjectDirectory';
import { Store } from '@/core/Store';
import { diContainer } from '@/di/Container';
import { setupWorkingDirectories } from '@/testHelpers/setupWorkingDirectories';
import { describe, expect, mock, spyOn, test } from 'bun:test';

describe('ChangeDirAction', () => {
  setupWorkingDirectories();

  test('should throw error when path is not provided', async () => {
    const mockContext = {
      projectDirectory: diContainer.get(ProjectDirectory),
      interpolate: mock(),
    } as unknown as Context;
    diContainer.register(Context, mockContext);

    const action = diContainer.get(ChangeDirAction);
    const actionData = {} as ChangeDirActionData;

    expect(action.execute(actionData)).rejects.toThrow(CodxError);
    expect(action.execute(actionData)).rejects.toThrow('Directory path is required for the changeDir action');
  });

  test('should change directory successfully', async () => {
    const mockPath = '/test/directory';
    const interpolatedPath = '/test/directory/interpolated';

    const mockProjectDirectory = diContainer.get(ProjectDirectory);
    mockProjectDirectory.change = mock(() => {});

    const mockStore = diContainer.get(Store);
    spyOn(mockStore, 'interpolate').mockReturnValue(interpolatedPath);

    const action = diContainer.get(ChangeDirAction);
    await action.execute({ path: mockPath } as ChangeDirActionData);

    expect(mockStore.interpolate).toHaveBeenCalledWith(mockPath);
    expect(mockProjectDirectory.change).toHaveBeenCalledWith(interpolatedPath);
    expect(mockProjectDirectory.get).toHaveBeenCalled();
  });

  test('should throw error when directory change fails', async () => {
    const mockPath = '/test/directory';
    const interpolatedPath = '/interpolated/test/directory';
    const mockError = new Error('Directory change failed');

    const mockProjectDirectory = diContainer.get(ProjectDirectory);
    spyOn(mockProjectDirectory, 'change').mockImplementation(() => {
      throw mockError;
    });
    spyOn(mockProjectDirectory, 'get');

    const mockStore = diContainer.get(Store);
    spyOn(mockStore, 'interpolate').mockReturnValue(interpolatedPath);

    const action = diContainer.get(ChangeDirAction);
    const actionData = { path: mockPath } as ChangeDirActionData;

    expect(action.execute(actionData)).rejects.toThrow(CodxError);
    expect(action.execute(actionData)).rejects.toThrow('Error changing directory');
  });
});
