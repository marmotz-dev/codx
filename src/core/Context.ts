import { Inject } from '@/di/InjectDecorator';
import { ProjectDirectory } from '@/core/ProjectDirectory';
import { RecipeDirectory } from '@/core/RecipeDirectory';
import { Store } from '@/core/Store';
import { relative } from 'node:path';

/**
 * Class that manages the execution context of a recipe
 * Stores variables defined during execution and the current working directory
 */
export class Context {
  /**
   * Creates a new context instance
   * @param {Store} store Variables store
   * @param {RecipeDirectory} recipeDirectory Recipe directory
   * @param {ProjectDirectory} projectDirectory Project directory
   */
  constructor(
    @Inject(Store) public readonly store: Store,
    @Inject(RecipeDirectory) public readonly recipeDirectory: RecipeDirectory,
    @Inject(ProjectDirectory) public readonly projectDirectory: ProjectDirectory,
  ) {
    this.store.setInternal('$CWD', process.cwd());

    recipeDirectory.observe({
      notify: (directory: string) => {
        this.updateStore('$RECIPE_DIRECTORY', directory);
      },
    });

    projectDirectory.observe({
      notify: (directory: string) => {
        this.updateStore('$PROJECT_DIRECTORY', directory);
        this.updateStore('$RELATIVE_PROJECT_DIRECTORY', relative(process.cwd(), directory));
      },
    });
  }

  private updateStore(variableName: string, newValue: string) {
    this.store.setInternal(variableName, newValue);
  }
}
