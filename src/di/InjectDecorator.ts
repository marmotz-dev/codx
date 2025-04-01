import { Constructor } from '@/di/Constructor.type';
import { injectionRegistry } from '@/di/InjectionRegistry';

export function Inject<T>(type: Constructor<T>) {
  return function (target: any, _: any, parameterIndex: number) {
    const params = injectionRegistry.get(target) || [];
    params.push({ parameterIndex, type });
    injectionRegistry.set(target, params);
  };
}
