import { CannotUnsetInternalVariableCodxError } from '@/core/errors/CannotUnsetInternalVariableCodxError';
import { CannotUnsetInternalVariableWithInvalidNameCodxError } from '@/core/errors/CannotUnsetInternalVariableWithInvalidNameCodxError';
import { Store } from '@/core/Store';
import { diContainer } from '@/di/Container';
import { beforeEach, describe, expect, test } from 'bun:test';

describe('Store', () => {
  let store: Store;

  beforeEach(() => {
    diContainer.reset();
    store = diContainer.get(Store);
    store.clear();
  });

  describe('set(Internal) and get methods', () => {
    test('should set and retrieve a variable', () => {
      store.set('name', 'John');
      expect(store.get<string>('name')).toBe('John');

      store.setInternal('$name', 'John');
      expect(store.get<string>('$name')).toBe('John');
    });

    test('should overwrite existing variable', () => {
      store.set('age', 25);
      store.set('age', 30);
      expect(store.get<number>('age')).toBe(30);

      store.setInternal('$size', 100);
      store.setInternal('$size', 200);
      expect(store.get<number>('$size')).toBe(200);
    });

    test('should return undefined for non-existent variable', () => {
      expect(store.get('nonexistent')).toBeUndefined();

      expect(store.get('$nonexistent')).toBeUndefined();
    });

    test('should support different types of values', () => {
      const numberVariable = 42;
      const booleanVariable = true;
      const objectVariable = { key: 'value' };
      const arrayVariable = [1, 2, 3];

      store.set('number', numberVariable);
      store.set('boolean', booleanVariable);
      store.set('object', objectVariable);
      store.set('array', arrayVariable);

      expect(store.get<number>('number')).toBe(numberVariable);
      expect(store.get<boolean>('boolean')).toBe(booleanVariable);
      expect(store.get<object>('object')).toEqual(objectVariable);
      expect(store.get<number[]>('array')).toEqual(arrayVariable);

      store.setInternal('$number', numberVariable);
      store.setInternal('$boolean', booleanVariable);
      store.setInternal('$object', objectVariable);
      store.setInternal('$array', arrayVariable);

      expect(store.get<number>('$number')).toBe(numberVariable);
      expect(store.get<boolean>('$boolean')).toBe(booleanVariable);
      expect(store.get<object>('$object')).toEqual(objectVariable);
      expect(store.get<number[]>('$array')).toEqual(arrayVariable);
    });
  });

  describe('unset method', () => {
    test('should remove a variable from the store', () => {
      store.set('testVar', 'value');
      expect(store.has('testVar')).toBeTrue();

      store.unset('testVar');
      expect(store.has('testVar')).toBeFalse();
      expect(store.get('testVar')).toBeUndefined();

      store.setInternal('$testVar', 'value');
      expect(store.has('$testVar')).toBeTrue();

      store.unsetInternal('$testVar');
      expect(store.has('$testVar')).toBeFalse();
      expect(store.get('$testVar')).toBeUndefined();
    });

    test('should not throw when unsetting a non-existent variable', () => {
      expect(() => store.unset('nonExistentVar')).not.toThrow();

      expect(() => store.unsetInternal('$nonExistentVar')).not.toThrow();
    });

    test('should throw error when trying to unset a variable with wrong method', () => {
      store.set('internalVar', 'value');

      expect(() => store.unsetInternal('internalVar')).toThrow(CannotUnsetInternalVariableWithInvalidNameCodxError);
      expect(() => store.unsetInternal('internalVar')).toThrow(
        `Cannot unset an internal variable "internalVar" that does not start with a $`,
      );
      expect(store.has('internalVar')).toBeTrue();

      store.setInternal('$internalVar', 'value');

      expect(() => store.unset('$internalVar')).toThrow(CannotUnsetInternalVariableCodxError);
      expect(() => store.unset('$internalVar')).toThrow('Cannot unset internal variable "$internalVar"');
      expect(store.has('$internalVar')).toBeTrue();
    });

    test('should not affect other variables when unsetting one variable', () => {
      store.set('var1', 'value1');
      store.set('var2', 'value2');

      store.unset('var1');

      expect(store.has('var1')).toBeFalse();
      expect(store.has('var2')).toBeTrue();
      expect(store.get<string>('var2')).toBe('value2');

      store.setInternal('$var1', 'value1');
      store.setInternal('$var2', 'value2');

      store.unsetInternal('$var1');

      expect(store.has('$var1')).toBeFalse();
      expect(store.has('$var2')).toBeTrue();
      expect(store.get<string>('$var2')).toBe('value2');
    });
  });

  describe('has method', () => {
    test('should return true for existing variable', () => {
      store.set('exists', 'value');
      expect(store.has('exists')).toBeTrue();
    });

    test('should return false for non-existent variable', () => {
      expect(store.has('nonexistent')).toBeFalse();
    });
  });

  describe('getAll method', () => {
    test('should return a copy of all variables', () => {
      store.set('key1', 'value1');
      store.set('key2', 'value2');

      const variables = store.getAll();
      expect(variables).toEqual({ key1: 'value1', key2: 'value2' });

      // Ensure it's a copy, not a reference
      variables['key3'] = 'value3';
      expect(store.has('key3')).toBeFalse();
    });

    test('should return an empty object when no variables are set', () => {
      expect(store.getAll()).toEqual({});
    });
  });

  describe('clear method', () => {
    test('should remove all variables', () => {
      store.set('key1', 'value1');
      store.set('key2', 'value2');

      store.clear();

      expect(store.getAll()).toEqual({});
      expect(store.has('key1')).toBeFalse();
      expect(store.has('key2')).toBeFalse();
    });
  });

  describe('interpolate method', () => {
    test('should replace variables in a string', () => {
      store.set('NAME', 'John');
      store.set('AGE', 30);

      const result = store.interpolate('Hello {NAME}, you are {AGE} years old');
      expect(result).toBe('Hello John, you are 30 years old');
    });

    test('should leave unreplaced variables unchanged', () => {
      store.set('NAME', 'Alice');

      const result = store.interpolate('Hello {NAME}, your score is {SCORE}');
      expect(result).toBe('Hello Alice, your score is {SCORE}');
    });

    test('should handle empty or null input', () => {
      expect(store.interpolate('')).toBe('');
      // @ts-expect-error allow null value for test
      expect(store.interpolate(null as unknown as string)).toBe(null);
    });

    test('should convert non-string values to strings during interpolation', () => {
      store.set('NUMBER', 42);
      store.set('BOOLEAN', true);

      const result = store.interpolate('Number: {NUMBER}, Boolean: {BOOLEAN}');
      expect(result).toBe('Number: 42, Boolean: true');
    });
  });
});
