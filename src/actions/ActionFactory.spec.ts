import { ActionFactory } from '@/actions/ActionFactory';
import { ActionRegistry } from '@/actions/ActionRegistry';
import { ActionsData, ActionsDataSchema } from '@/actions/Actions.schema';
import { BaseAction } from '@/actions/BaseAction';
import { MessageAction } from '@/actions/message/MessageAction';
import { CodxError } from '@/core/CodxError';
import { beforeEach, describe, expect, it } from 'bun:test';

describe('ActionFactory', () => {
  let actionFactory: ActionFactory;
  let mockRegistry: ActionRegistry;

  class TestAction extends BaseAction {
    public async execute() {}
  }

  beforeEach(() => {
    // Create a mock registry for testing
    mockRegistry = {
      'test-action': TestAction,
    };

    actionFactory = new ActionFactory(mockRegistry);
  });

  it('should create an action when the type exists in the registry', () => {
    const actionData = {
      type: 'test-action',
    } as unknown as ActionsData;

    const createdAction = actionFactory.createAction(actionData);

    expect(createdAction).toBeTruthy();
    expect(createdAction).toBeInstanceOf(mockRegistry['test-action']);
  });

  it('should throw CodxError when action type is not in the registry', () => {
    const actionData = {
      type: 'non-existent-action',
    } as unknown as ActionsData;

    const getAction = () => actionFactory.createAction(actionData);
    expect(getAction).toThrow(CodxError);
    expect(getAction).toThrow('Unknown action type: non-existent-action');
  });

  it('should use default registry if no registry is provided in constructor', () => {
    const defaultActionFactory = new ActionFactory();

    // You might need to add a known action type from the default registry
    const actionData = ActionsDataSchema.parse({
      type: 'message',
      content: 'Welcome',
    });

    const getAction = () => defaultActionFactory.createAction(actionData);
    expect(getAction).not.toThrow();
    expect(getAction()).toBeInstanceOf(MessageAction);
  });
});
