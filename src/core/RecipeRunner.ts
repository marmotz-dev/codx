import { ActionFactory } from '@/actions/ActionFactory';
import { ConditionEvaluator } from '@/core/ConditionEvaluator';
import { Context } from '@/core/Context';
import { Logger } from '@/core/Logger';
import { Recipe, Step } from '@/core/Recipe.schema';
import { Inject } from '@/di/InjectDecorator';
import chalk from 'chalk';

/**
 * Class responsible for executing recipes
 */
export class RecipeRunner {
  /**
   * Creates a new RecipeRunner instance
   * @param {Context} context
   * @param {ConditionEvaluator} conditionEvaluator Allows evaluating conditions
   * @param {ActionFactory} actionFactory Factory used to create actions
   * @param {Logger} logger
   */
  constructor(
    @Inject(Context) private readonly context: Context,
    @Inject(ConditionEvaluator) private readonly conditionEvaluator: ConditionEvaluator,
    @Inject(ActionFactory) private readonly actionFactory: ActionFactory,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  /**
   * Executes the recipe
   * @returns A promise that resolves when execution is complete
   */
  public async run(recipe: Recipe, projectDir?: string): Promise<void> {
    if (projectDir) {
      this.context.projectDirectory.init(projectDir);
    }

    const titleLength = 24;

    this.logger.message(
      `${'Recipe directory'.padEnd(titleLength, '.')} : ${chalk.gray(this.context.recipeDirectory.get())}`,
    );
    this.logger.message(
      `${'Project directory'.padEnd(titleLength, '.')} : ${chalk.gray(this.context.projectDirectory.get())}`,
    );
    this.logger.message(
      `${'Using package manager'.padEnd(titleLength, '.')} : ${chalk.gray(this.context.store.get('$PACKAGE_MANAGER'))}`,
    );

    this.logger.message(`${'Recipe description'.padEnd(titleLength, '.')} : ${chalk.yellow(recipe.description)}`);
    if (recipe.author) {
      this.logger.message(`${'Recipe author'.padEnd(titleLength, '.')} : ${chalk.gray(recipe.author)}`);
    }

    const lineLength = 70;
    try {
      await this.executeSteps(recipe.steps);
      this.logger.message('-'.repeat(lineLength));
      this.logger.message('Recipe executed successfully.');
    } catch (error) {
      this.logger.error('-'.repeat(lineLength));
      this.logger.error('Recipe execution failed:');

      if (error instanceof Error) {
        this.logger.error(error.message);
      } else {
        this.logger.error(error);
      }

      throw error;
    }
  }

  private async executeStep(step: Step): Promise<void> {
    const { name, condition, action: actionData, workingDirectory, variable } = step;

    this.logStepStart(name);

    if (!this.shouldExecuteStep(condition)) {
      return;
    }

    const action = this.actionFactory.createAction(actionData);
    const currentWorkingDirectory = this.context.projectDirectory.get();

    try {
      if (workingDirectory) {
        this.context.projectDirectory.change(workingDirectory);
      }

      const result = await action.execute(step.action);

      if (result !== undefined) {
        if (variable) {
          this.context.store.set(variable, result);
        } else {
          this.logger.debug(
            `Result of action ${actionData.type} (non stored in variable) is ${JSON.stringify(result, null, 2)}`,
          );
        }
      }

      await this.handleStepSuccess(step);
    } catch (error) {
      if (step.onFailure) {
        await this.handleStepError(step);
      } else {
        // If there's no onFailure, propagate the original error
        throw error;
      }
    } finally {
      if (workingDirectory && workingDirectory === this.context.projectDirectory.get()) {
        this.context.projectDirectory.change(currentWorkingDirectory);
      }
    }
  }

  /**
   * Executes a list of steps
   * @param steps The steps to execute
   */
  private async executeSteps(steps: Step[]): Promise<void> {
    for (const step of steps) {
      await this.executeStep(step);
    }
  }

  private async handleStepError(step: Step): Promise<void> {
    if (step.onFailure) {
      await this.executeSteps(step.onFailure);
    }

    if (step.finally) {
      await this.executeSteps(step.finally);
    }
  }

  private async handleStepSuccess(step: Step): Promise<void> {
    if (step.onSuccess) {
      await this.executeSteps(step.onSuccess);
    }

    if (step.finally) {
      await this.executeSteps(step.finally);
    }
  }

  private logStepStart(name?: string): void {
    this.logger.message();

    if (name) {
      this.logger.message(chalk.bold.blue('## ' + name));
    }
  }

  private shouldExecuteStep(condition?: string): boolean {
    if (condition) {
      this.logger.debug(`Evaluating condition: ${condition}`);

      const conditionResult = this.conditionEvaluator.evaluate(condition, this.context.store.getAll());
      if (!conditionResult) {
        this.logger.warning('Condition not met, step skipped.');

        return false;
      } else {
        this.logger.debug(`Condition met, step executed.`);
      }
    }

    return true;
  }
}
