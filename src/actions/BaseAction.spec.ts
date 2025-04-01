import { ActionsData } from '@/actions/Actions.schema';
import { BaseAction } from '@/actions/BaseAction';
import { Store } from '@/core/Store';
import { diContainer } from '@/di/Container';
import { beforeEach, describe, expect, it, Mock, spyOn } from 'bun:test';

// Create a concrete implementation to test abstract class
class TestAction extends BaseAction {
  async execute(actionData: ActionsData): Promise<any> {
    return `Executed with ${this.interpolate(actionData.type as string)}`;
  }
}

describe('BaseAction', () => {
  let action: TestAction;
  let mockStoreInterpolateSpy: Mock<any>;

  beforeEach(() => {
    diContainer.reset();

    const store = diContainer.get(Store);
    mockStoreInterpolateSpy = spyOn(store, 'interpolate').mockImplementation(
      (value: string) => `interpolated-${value}`,
    );

    // Create test action instance with mocked context
    action = diContainer.get(TestAction);
  });

  it('should correctly execute the action', async () => {
    const actionData = { type: 'test-action' } as unknown as ActionsData;
    const result = await action.execute(actionData);

    expect(result).toBe('Executed with interpolated-test-action');
  });

  it('should call context.store.interpolate when interpolating values', async () => {
    const testString = 'test-value';

    action['interpolate'](testString);

    expect(mockStoreInterpolateSpy).toHaveBeenCalledWith(testString);
    expect(mockStoreInterpolateSpy).toHaveBeenCalledTimes(1);
  });

  it('should return the interpolated value from context.store', () => {
    const testString = 'test-variable';
    const result = action['interpolate'](testString);

    expect(result).toBe('interpolated-test-variable');
  });
});
