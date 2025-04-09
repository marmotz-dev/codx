import { FailActionData } from '@/actions/fail/FailAction.schema';
import { CodxError } from '@/core/CodxError';
import { diContainer } from '@/di/Container';
import { beforeEach, describe, expect, it } from 'bun:test';
import { FailAction } from './FailAction';

describe('FailAction', () => {
  let failAction: FailAction;

  beforeEach(() => {
    diContainer.reset();
    failAction = diContainer.get(FailAction);
  });

  it('should throw a CodxError with a default message when no message is provided', async () => {
    const actionData = { type: 'fail' } as FailActionData;

    try {
      await failAction.execute(actionData);
      // If we reach this point, the test should fail
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toBeInstanceOf(CodxError);
      expect((error as CodxError).message).toBe('Explicit failure triggered by fail action');
    }
  });

  it('should throw a CodxError with the provided message', async () => {
    const customMessage = 'Custom error message';
    const actionData = { type: 'fail', message: customMessage } as FailActionData;

    try {
      await failAction.execute(actionData);
      // If we reach this point, the test should fail
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toBeInstanceOf(CodxError);
      expect((error as CodxError).message).toBe(customMessage);
    }
  });
});
