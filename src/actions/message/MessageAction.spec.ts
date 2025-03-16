import { MessageAction } from '@/actions/message/MessageAction';
import { MessageActionData } from '@/actions/message/MessageAction.schema';
import { CodxError } from '@/core/CodxError';
import { Context } from '@/core/Context';
import { diContainer } from '@/di/Container';
import { Logger } from '@/core/Logger';
import { Store } from '@/core/Store';
import { describe, expect, mock, spyOn, test } from 'bun:test';

describe('MessageAction', () => {
  test('should throw error when content is not provided', async () => {
    const mockLogger = {
      message: mock(),
    };

    const action = new MessageAction(mockLogger as any, diContainer.get(Context));
    const actionData = { style: 'default' } as MessageActionData;

    expect(action.execute(actionData)).rejects.toThrow(CodxError);
    expect(action.execute(actionData)).rejects.toThrow('Message action requires a content parameter');
  });

  test('should display message with default style', async () => {
    const mockContent = 'Test message';
    const interpolatedContent = 'Interpolated test message';

    const mockLogger = diContainer.get(Logger);
    spyOn(mockLogger, 'message').mockImplementation(() => {});

    const mockStore = diContainer.get(Store);
    spyOn(mockStore, 'interpolate').mockReturnValue(interpolatedContent);

    const action = new MessageAction(mockLogger, diContainer.get(Context));

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

    const action = new MessageAction(mockLogger, diContainer.get(Context));

    await action.execute({ content: mockContent, style, type: 'message' });

    expect(mockStore.interpolate).toHaveBeenCalledWith(mockContent);
    expect(mockLogger.message).toHaveBeenCalledWith(interpolatedContent, style);
  });
});
