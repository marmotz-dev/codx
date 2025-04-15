import { DependencyNotFoundCodxError } from '@/core/errors/DependencyNotFoundCodxError';
import { InstantiationFailedCodxError } from '@/core/errors/InstantiationFailedCodxError';
import { Constructor } from '@/di/Constructor.type';
import { injectionRegistry } from '@/di/InjectionRegistry';

class DIContainer {
  private readonly dependencies: Map<any, any> = new Map();

  get<T>(token: Constructor<T>): T {
    let dependency = this.dependencies.get(token);

    if (!dependency) {
      if (typeof token === 'function') {
        try {
          dependency = this.createInstance(token);

          this.dependencies.set(token, dependency);
        } catch (error) {
          throw new InstantiationFailedCodxError(token.name, error);
        }
      } else {
        throw new DependencyNotFoundCodxError(token);
      }
    }

    return dependency as T;
  }

  register<T>(token: Constructor<T>, dependency: T): void {
    this.dependencies.set(token, dependency);
  }

  reset() {
    this.dependencies.clear();
  }

  // Create an instance with automatic injection
  private createInstance<T>(ClassType: Constructor<T>): T {
    // Traverse the prototype chain to find constructor parameters
    let currentClass: Constructor<any> | null = ClassType;
    let injectionParams: any[] = [];

    while (currentClass) {
      const currentInjectionParams = injectionRegistry.get(currentClass) ?? [];

      if (currentInjectionParams.length > 0) {
        injectionParams = currentInjectionParams;
        break;
      }

      currentClass = Object.getPrototypeOf(currentClass);
    }

    const args: any[] = [];

    for (let i = 0; i < injectionParams.length; i++) {
      // Search if this parameter has injection metadata
      const injectionParam = injectionParams.find((p) => p.parameterIndex === i);

      if (injectionParam) {
        args[i] = this.get(injectionParam.type);
      } else {
        args[i] = undefined;
      }
    }

    // Create the instance with injected dependencies
    return new ClassType(...args);
  }
}

export const diContainer = new DIContainer();
