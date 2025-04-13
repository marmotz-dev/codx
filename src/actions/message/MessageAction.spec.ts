import { MessageAction } from '@/actions/message/MessageAction';
import { MessageActionData } from '@/actions/message/MessageAction.schema';
import { Context } from '@/core/Context';
import { MissingContentCodxError } from '@/core/errors/MissingContentCodxError';
import { Logger } from '@/core/Logger';
import { Store } from '@/core/Store';
import { diContainer } from '@/di/Container';
import { describe, expect, mock, spyOn, test } from 'bun:test';

describe('MessageAction', () => {
  test('should throw error when content is not provided', async () => {
    const mockLogger = {
      message: mock(),
    } as unknown as Logger;

    const action = new MessageAction(diContainer.get(Context), mockLogger);
    const actionData = { style: 'default' } as MessageActionData;

    expect(action.execute(actionData)).rejects.toThrow(MissingContentCodxError);
    expect(action.execute(actionData)).rejects.toThrow('Content is required for this action');
  });

  test('should display message with default style', async () => {
    const mockContent = 'Test message';
    const interpolatedContent = 'Interpolated test message';

    const mockLogger = diContainer.get(Logger);
    spyOn(mockLogger, 'message').mockImplementation(() => {});

    const mockStore = diContainer.get(Store);
    spyOn(mockStore, 'interpolate').mockReturnValue(interpolatedContent);

    const action = new MessageAction(diContainer.get(Context), mockLogger);

    await action.execute({ type: 'message', content: mockContent } as MessageActionData);

    expect(mockStore.interpolate).toHaveBeenCalledWith(mockContent);
    expect(mockLogger.message).toHaveBeenCalledWith(interpolatedContent, 'default');
  });

  test('should display message with specified style', async () => {
    const mockContent = 'Test message';
    const interpolatedContent = 'Interpolated test message';
    const style = 'success';

    const mockLogger = diContainer.get(Logger);
    spyOn(mockLogger, 'message').mockImplementation(() => {});

    const mockStore = diContainer.get(Store);
    spyOn(mockStore, 'interpolate').mockReturnValue(interpolatedContent);

    const action = new MessageAction(diContainer.get(Context), mockLogger);

    await action.execute({ content: mockContent, style, type: 'message' });

    expect(mockStore.interpolate).toHaveBeenCalledWith(mockContent);
    expect(mockLogger.message).toHaveBeenCalledWith(interpolatedContent, style);
  });
});
