import { IObserver } from '@/core/Observer.interface';
import { ProjectDirectory } from '@/core/ProjectDirectory';
import { diContainer } from '@/di/Container';
import { MockCleaner, mockModule } from '@/testHelpers/mockModule';
import { setupWorkingDirectories } from '@/testHelpers/setupWorkingDirectories';
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';

describe('ProjectDirectory', () => {
  const { mockProjectDir } = setupWorkingDirectories();
  let projectDirectory: ProjectDirectory;
  let mockObserver: IObserver<string>;
  let mockFsCleaner: MockCleaner;
  let mockPathCleaner: MockCleaner;

  beforeEach(async () => {
    // Réinitialisation des mocks
    mock.restore();

    mockFsCleaner = await mockModule('fs', () => ({
      existsSync: mock(() => true),
      statSync: mock(() => ({ isDirectory: () => true })),
    }));

    mockPathCleaner = await mockModule('path', () => ({
      isAbsolute: (path: string) => path.startsWith('/'),
      resolve: (...paths: string[]) => paths.join('/'),
    }));

    // Création d'un observer mock
    mockObserver = {
      notify: mock(() => {}),
    };

    // Initialisation de la classe à tester
    projectDirectory = diContainer.get(ProjectDirectory);
    projectDirectory.observe(mockObserver);
  });

  afterEach(() => {
    mockFsCleaner();
    mockPathCleaner();
  });

  describe('change', () => {
    it('should change the current directory with an absolute path', () => {
      const newDir = `${mockProjectDir}/absolute/path`;

      projectDirectory.change(newDir);

      expect(projectDirectory.get()).toBe(newDir);
      expect(mockObserver.notify).toHaveBeenCalledWith(newDir);
    });

    it('should change the current directory to a relative path', () => {
      const initialDir = projectDirectory.get();
      const relativeDir = 'relative/path';
      const expectedDir = `${initialDir}/${relativeDir}`;

      projectDirectory.change(relativeDir);

      expect(projectDirectory.get()).toBe(expectedDir);
      expect(mockObserver.notify).toHaveBeenCalledWith(expectedDir);
    });

    it('should throw an error if the directory does not exist', () => {
      mock.module('fs', () => ({
        existsSync: mock(() => false),
        statSync: mock(() => ({ isDirectory: () => true })),
      }));

      const nonExistentDir = 'non-existent';

      expect(() => {
        projectDirectory.change(nonExistentDir);
      }).toThrow(/does not exist/);
    });

    it('should throw an error if the path is not a directory', () => {
      mock.module('fs', () => ({
        existsSync: mock(() => true),
        statSync: mock(() => ({ isDirectory: () => false })),
      }));

      const notDirectory = 'file.txt';

      expect(() => {
        projectDirectory.change(notDirectory);
      }).toThrow(/is not a directory/);
    });

    it('should notify all watchers when directory changes', () => {
      const anotherObserver = {
        notify: mock(() => {}),
      };

      projectDirectory.observe(anotherObserver);

      const newDir = `${mockProjectDir}/new/directory`;
      projectDirectory.change(newDir);

      expect(mockObserver.notify).toHaveBeenCalledWith(newDir);
      expect(anotherObserver.notify).toHaveBeenCalledWith(newDir);
    });
  });

  describe('reset', () => {
    it('should reset to the initial directory', () => {
      // Set up initial directory through init
      const initialDir = `${mockProjectDir}`;
      projectDirectory.init(initialDir);

      // Change to a different directory
      const newDir = `${mockProjectDir}/different`;
      projectDirectory.change(newDir);

      // Reset to initial directory
      projectDirectory.reset();

      // Verify we're back to the initial directory
      expect(projectDirectory.get()).toBe(initialDir);
      expect(mockObserver.notify).toHaveBeenCalledWith(initialDir);
    });

    it('should notify observers when reset is called', () => {
      // Set up multiple observers
      const anotherObserver = {
        notify: mock(() => {}),
      };
      projectDirectory.observe(anotherObserver);

      // Set up initial directory
      const initialDir = `${mockProjectDir}`;
      projectDirectory.init(initialDir);

      // Change directory and reset
      projectDirectory.change(`${mockProjectDir}/another`);
      projectDirectory.reset();

      // Verify all observers were notified
      expect(mockObserver.notify).toHaveBeenCalledWith(initialDir);
      expect(anotherObserver.notify).toHaveBeenCalledWith(initialDir);
    });

    it('should reset to the initial directory even after multiple changes', () => {
      // Set up initial directory
      const initialDir = `${mockProjectDir}`;
      projectDirectory.init(initialDir);

      // Change directories multiple times
      projectDirectory.change(`${mockProjectDir}/dir1`);
      projectDirectory.change(`${mockProjectDir}/dir2`);
      projectDirectory.change(`${mockProjectDir}/dir3`);

      // Reset to initial directory
      projectDirectory.reset();

      // Verify we're back to the initial directory
      expect(projectDirectory.get()).toBe(initialDir);
    });
  });
});
