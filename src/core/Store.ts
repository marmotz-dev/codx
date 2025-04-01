import { CodxError } from '@/core/CodxError';
import { Logger } from '@/core/Logger';
import { VariablesInterpolator } from '@/core/VariablesInterpolator';
import { Inject } from '@/di/InjectDecorator';

/**
 * Manages a store of key-value variables with type-safe operations
 */
export class Store {
  private variables: Record<string, any> = {};

  constructor(
    @Inject(VariablesInterpolator) private readonly variablesInterpolator: VariablesInterpolator,
    @Inject(Logger) private readonly logger: Logger,
  ) {}

  /**
   * Clears all variables from the store
   */
  public clear(): void {
    this.variables = {};
  }

  /**
   * Gets the value of a variable from the store
   * @param name Name of the variable
   * @returns Value of the variable or undefined if it doesn't exist
   */
  public get<T = string | number>(name: string): T | undefined {
    return (this.variables[name] as T) ?? undefined;
  }

  /**
   * Gets all variables from the store
   * @returns A shallow copy of all variables
   */
  public getAll(): Record<string, any> {
    return { ...this.variables };
  }

  /**
   * Checks if a variable exists in the store
   * @param name Name of the variable
   * @returns true if the variable exists, false otherwise
   */
  public has(name: string): boolean {
    return name in this.variables;
  }

  /**
   * Replaces variables in a string with their values
   * @param input String containing variables to replace
   * @returns String with variables replaced
   */
  public interpolate(input: string): string {
    if (!input) {
      return input;
    }

    return this.variablesInterpolator.interpolate(input, this.variables);
  }

  /**
   * Sets a variable in the store
   * @param name Name of the variable
   * @param value Value of the variable
   */
  public set(name: string, value: any): void {
    if (name.startsWith('$')) {
      throw new CodxError(`Cannot set internal variable "${name}"`);
    }

    this.setVariable(name, value);
  }

  /**
   * Sets an internal variable in the store
   * @param name Name of the variable
   * @param value Value of the variable
   */
  public setInternal(name: string, value: any): void {
    if (!name.startsWith('$')) {
      throw new CodxError(`Cannot set an internal variable that does not start with a $ "${name}"`);
    }

    this.setVariable(name, value);
  }

  /**
   * Sets a variable in the store
   * @param name Name of the variable
   * @param value Value of the variable
   */
  private setVariable(name: string, value: any): void {
    this.variables[name] = value;

    this.logger.debug(`Variable "${name}" set to ${JSON.stringify(value, undefined, 2)}`);
  }
}
