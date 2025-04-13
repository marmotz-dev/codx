import { FailActionData } from '@/actions/fail/FailAction.schema';
import { ExplicitFailureCodxError } from '@/core/errors/ExplicitFailureCodxError';
import { diContainer } from '@/di/Container';
import { beforeEach, describe, expect, it } from 'bun:test';
import { FailAction } from './FailAction';

describe('FailAction', () => {
  let failAction: FailAction;

  beforeEach(() => {
    diContainer.reset();
    failAction = diContainer.get(FailAction);
  });

  it('should throw an ExplicitFailureCodxError with a default message when no message is provided', async () => {
    const actionData = { type: 'fail' } as FailActionData;

    try {
      await failAction.execute(actionData);
      // If we reach this point, the test should fail
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toBeInstanceOf(ExplicitFailureCodxError);
      expect((error as ExplicitFailureCodxError).message).toBe('Explicit failure triggered by fail action');
    }
  });

  it('should throw an ExplicitFailureCodxError with the provided message', async () => {
    const customMessage = 'Custom error message';
    const actionData = { type: 'fail', message: customMessage } as FailActionData;

    try {
      await failAction.execute(actionData);
      // If we reach this point, the test should fail
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toBeInstanceOf(ExplicitFailureCodxError);
      expect((error as ExplicitFailureCodxError).message).toBe(customMessage);
    }
  });
});
