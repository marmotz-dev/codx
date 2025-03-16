import { diContainer } from '@/di/Container';
import { Inject } from '@/di/InjectDecorator';
import { describe, expect, test } from 'bun:test';

// Mock classes for testing
class MockDependency {
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}

class ComplexClass {
  constructor(@Inject(MockDependency) public dependency: MockDependency) {}
}

describe('DIContainer', () => {
  test('should register and get a dependency', () => {
    const mockDep = new MockDependency('test');
    diContainer.register(MockDependency, mockDep);

    const dep = diContainer.get(MockDependency);
    expect(dep).toBe(mockDep);
  });

  test('should create instance with auto-injection', () => {
    const mockDep = new MockDependency('injected');
    diContainer.register(MockDependency, mockDep);

    const complexInstance = diContainer.get(ComplexClass);
    expect(complexInstance.dependency).toBe(mockDep);
  });

  test('should auto-create dependency if not registered', () => {
    class SimpleClass {
      value = 'auto-created';
    }

    const instance = diContainer.get(SimpleClass);
    expect(instance).toBeInstanceOf(SimpleClass);
    expect(instance.value).toBe('auto-created');
  });

  test('should cache created instances', () => {
    class SingletonClass {
      static instanceCount = 0;

      constructor() {
        SingletonClass.instanceCount++;
      }
    }

    const firstInstance = diContainer.get(SingletonClass);
    const secondInstance = diContainer.get(SingletonClass);

    expect(firstInstance).toBe(secondInstance);
    expect(SingletonClass.instanceCount).toBe(1);
  });

  describe('reset()', () => {
    test('should clear all dependencies when reset is called', () => {
      // Register a dependency
      const mockDep = new MockDependency('test-reset');
      diContainer.register(MockDependency, mockDep);

      // Verify it's registered
      const dep = diContainer.get(MockDependency);
      expect(dep).toBe(mockDep);

      // Reset the container
      diContainer.reset();

      // After reset, the container should create a new instance
      const newDep = diContainer.get(MockDependency);
      expect(newDep).not.toBe(mockDep);
      expect(newDep).toBeInstanceOf(MockDependency);
    });

    test('should recreate instances after reset', () => {
      class CounterClass {
        static instanceCount = 0;
        id: number;

        constructor() {
          CounterClass.instanceCount++;
          this.id = CounterClass.instanceCount;
        }
      }

      // Get first instance
      const firstInstance = diContainer.get(CounterClass);
      expect(firstInstance.id).toBe(1);

      // Reset container
      diContainer.reset();

      // Get new instance after reset
      const newInstance = diContainer.get(CounterClass);
      expect(newInstance.id).toBe(2); // New instance with incremented counter
      expect(newInstance).not.toBe(firstInstance);
    });
  });

  describe('Inheritance', () => {
    class Dependency {}

    class BaseClassWithInjection {
      constructor(@Inject(Dependency) public dependency: Dependency) {}
    }

    class ChildClassNoConstructor extends BaseClassWithInjection {
      // No constructor defined
    }

    class GrandChildClassNoConstructor extends ChildClassNoConstructor {
      // No constructor defined
    }

    test('should inject parent class dependencies when child class has no constructor', () => {
      const dep = new Dependency();
      diContainer.register(Dependency, dep);

      const childInstance = diContainer.get(ChildClassNoConstructor);
      expect(childInstance.dependency).toBe(dep);
    });

    test('should inject parent class dependencies when grandchild class has no constructor', () => {
      const dep = new Dependency();
      diContainer.register(Dependency, dep);

      const grandChildInstance = diContainer.get(GrandChildClassNoConstructor);
      expect(grandChildInstance.dependency).toBe(dep);
    });
  });
});
