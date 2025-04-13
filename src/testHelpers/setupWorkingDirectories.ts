import { ProjectDirectory } from '@/core/ProjectDirectory';
import { RecipeDirectory } from '@/core/RecipeDirectory';
import { diContainer } from '@/di/Container';
import { beforeEach, spyOn } from 'bun:test';

export function setupWorkingDirectories() {
  const mockRecipeDir = '/mock/recipe/dir';
  const mockProjectDir = '/mock/project/dir';
  let mockRecipeDirectory: RecipeDirectory;
  let mockProjectDirectory: ProjectDirectory;

  beforeEach(() => {
    diContainer.reset();

    mockRecipeDirectory = new RecipeDirectory();
    mockRecipeDirectory['currentDirectory'] = mockRecipeDir;
    spyOn(mockRecipeDirectory, 'get').mockReturnValue(mockRecipeDir);
    diContainer.register(RecipeDirectory, mockRecipeDirectory);

    mockProjectDirectory = new ProjectDirectory();
    mockProjectDirectory['initialDirectory'] = mockProjectDir;
    mockProjectDirectory['currentDirectory'] = mockProjectDir;
    spyOn(mockProjectDirectory, 'get').mockReturnValue(mockProjectDir);
    spyOn(mockProjectDirectory, 'reset').mockImplementation(
      () => (mockProjectDirectory['currentDirectory'] = mockProjectDir),
    );
    diContainer.register(ProjectDirectory, mockProjectDirectory);
  });

  return {
    mockRecipeDir,
    mockProjectDir,
  };
}
