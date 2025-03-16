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

  describe('set and get methods', () => {
    test('should set and retrieve a variable', () => {
      store.set('name', 'John');
      expect(store.get('name')).toBe('John');
    });

    test('should overwrite existing variable', () => {
      store.set('age', 25);
      store.set('age', 30);
      expect(store.get('age')).toBe(30);
    });

    test('should return undefined for non-existent variable', () => {
      expect(store.get('nonexistent')).toBeUndefined();
    });

    test('should support different types of values', () => {
      const numberVariable = 42;
      store.set('number', numberVariable);
      const booleanVariable = true;
      store.set('boolean', booleanVariable);
      const objectVariable = { key: 'value' };
      store.set('object', objectVariable);
      const arrayVariable = [1, 2, 3];
      store.set('array', arrayVariable);

      expect(store.get('number')).toBe(numberVariable);
      expect(store.get('boolean')).toBe(booleanVariable);
      expect(store.get('object')).toEqual(objectVariable);
      expect(store.get('array')).toEqual(arrayVariable);
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
