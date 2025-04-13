import { ActionFactory } from '@/actions/ActionFactory';
import { CodxError } from '@/core/CodxError';
import { ConditionEvaluator } from '@/core/ConditionEvaluator';
import { ProjectDirectory } from '@/core/ProjectDirectory';
import { Recipe } from '@/core/Recipe.schema';
import { RecipeRunner } from '@/core/RecipeRunner';
import { Store } from '@/core/Store';
import { diContainer } from '@/di/Container';
import { setupConsole } from '@/testHelpers/setupConsole';
import { beforeEach, describe, expect, mock, spyOn, test } from 'bun:test';

describe('RecipeRunner', () => {
  setupConsole();

  let conditionEvaluator: ConditionEvaluator;
  let store: Store;
  let projectDirectory: ProjectDirectory;
  let recipeRunner: RecipeRunner;
  let actionFactory: ActionFactory;

  beforeEach(() => {
    diContainer.reset();
    conditionEvaluator = diContainer.get(ConditionEvaluator);

    projectDirectory = diContainer.get(ProjectDirectory);
    spyOn(projectDirectory, 'change').mockImplementation(() => {});

    store = diContainer.get(Store);

    actionFactory = diContainer.get(ActionFactory);

    recipeRunner = diContainer.get(RecipeRunner);
  });

  test('should execute recipe with successful steps', async () => {
    const mockAction = {
      execute: mock(() => Promise.resolve()),
    };

    spyOn(actionFactory, 'createAction').mockReturnValue(mockAction);

    const recipe = {
      description: 'A test recipe',
      steps: [{ action: 'testAction1' }, { action: 'testAction2' }],
    } as unknown as Recipe;

    expect(recipeRunner.run(recipe, process.cwd())).resolves.toBeUndefined();
    expect(mockAction.execute).toHaveBeenCalledTimes(2);
    expect(mockAction.execute).toHaveBeenCalledWith('testAction1');
    expect(mockAction.execute).toHaveBeenCalledWith('testAction2');
  });

  test('should skip step with unknown condition', async () => {
    const mockAction = {
      execute: mock(() => Promise.resolve()),
    };

    spyOn(actionFactory, 'createAction').mockReturnValue(mockAction);
    spyOn(conditionEvaluator, 'evaluate').mockReturnValueOnce(false);

    const recipe: Recipe = {
      description: 'A test recipe',
      steps: [
        {
          action: 'testAction1',
          condition: 'test-condition',
          name: 'Step 1',
        },
        { action: 'testAction2' },
      ],
    } as unknown as Recipe;

    expect(recipeRunner.run(recipe, process.cwd())).resolves.toBeUndefined();
    expect(conditionEvaluator.evaluate).toHaveBeenCalledWith('test-condition', store.getAll());
    expect(mockAction.execute).toHaveBeenCalledTimes(1);
  });

  test('should execute onSuccess steps when step succeeds', async () => {
    const mockMainAction = {
      execute: mock(() => Promise.resolve()),
    };

    const mockSuccessAction = {
      execute: mock(() => Promise.resolve()),
    };

    spyOn(actionFactory, 'createAction').mockReturnValueOnce(mockMainAction).mockReturnValueOnce(mockSuccessAction);

    const recipe: Recipe = {
      description: 'A test recipe',
      steps: [
        {
          action: 'mainAction',
          onSuccess: [{ action: 'successAction' }],
        },
      ],
    } as unknown as Recipe;

    expect(recipeRunner.run(recipe, process.cwd())).resolves.toBeUndefined();
    expect(mockMainAction.execute).toHaveBeenCalled();
    expect(mockSuccessAction.execute).toHaveBeenCalled();
  });

  test('should execute onFailure and finally steps when step fails', async () => {
    const mockMainAction = {
      execute: mock(() => {
        throw new CodxError('Test error');
      }),
    };

    const mockFailureAction = {
      execute: mock(() => Promise.resolve()),
    };

    const mockFinallyAction = {
      execute: mock(() => Promise.resolve()),
    };

    spyOn(actionFactory, 'createAction')
      .mockReturnValueOnce(mockMainAction)
      .mockReturnValueOnce(mockFailureAction)
      .mockReturnValueOnce(mockFinallyAction);

    const recipe = {
      description: 'A test recipe',
      steps: [
        {
          action: 'action',
          onFailure: [{ action: 'onFailure' }],
          finally: [{ action: 'finally' }],
        },
      ],
    } as unknown as Recipe;

    expect(recipeRunner.run(recipe)).resolves.toBeUndefined();
    expect(mockMainAction.execute).toHaveBeenCalled();
    expect(mockFailureAction.execute).toHaveBeenCalled();
    expect(mockFinallyAction.execute).toHaveBeenCalled();
  });

  test('should store error in context when step fails', async () => {
    const testError = new CodxError('Test error');
    const mockMainAction = {
      execute: mock(() => {
        throw testError;
      }),
    };

    const mockFailureAction = {
      execute: mock(() => Promise.resolve()),
    };

    spyOn(actionFactory, 'createAction').mockReturnValueOnce(mockMainAction).mockReturnValueOnce(mockFailureAction);
    spyOn(store, 'set').mockImplementation(() => {});

    const recipe = {
      description: 'A test recipe',
      steps: [
        {
          action: 'action',
          onFailure: [{ action: 'onFailure' }],
        },
      ],
    } as unknown as Recipe;

    await recipeRunner.run(recipe);

    expect(mockMainAction.execute).toHaveBeenCalled();
    expect(store.set).toHaveBeenCalledWith('error', testError);
  });

  test('should save action return value to the specified variable', async () => {
    const mockReturnValue = 'test-return-value';
    const mockVariableName = 'TEST_VARIABLE';

    const mockAction = {
      execute: mock(() => Promise.resolve(mockReturnValue)),
    };

    spyOn(actionFactory, 'createAction').mockReturnValue(mockAction);
    spyOn(store, 'set').mockImplementation(() => {});

    const recipe: Recipe = {
      description: 'A test recipe',
      steps: [
        {
          action: 'testAction',
          variable: mockVariableName,
        },
      ],
    } as unknown as Recipe;

    await recipeRunner.run(recipe, process.cwd());

    expect(mockAction.execute).toHaveBeenCalledTimes(1);
    expect(store.set).toHaveBeenCalledWith(mockVariableName, mockReturnValue);
  });
});
