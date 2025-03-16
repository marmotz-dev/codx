import { Utils } from '@/core/Utils';
import { describe, expect, test } from 'bun:test';

describe('Utils', () => {
  describe('flatObject', () => {
    test('should return an empty object when input is empty', () => {
      const input = {};
      const result = Utils.flatObject(input);
      expect(result).toEqual({});
    });

    test('should flatten a simple object with string values', () => {
      const input = { a: '1', b: '2' };
      const result = Utils.flatObject(input);
      expect(result).toEqual({ a: '1', b: '2' });
    });

    test('should flatten a simple object with numeric values', () => {
      const input = { a: 1, b: 2 };
      const result = Utils.flatObject(input);
      expect(result).toEqual({ a: 1, b: 2 });
    });

    test('should flatten a nested object', () => {
      const input = {
        a: {
          b: 1,
          c: 2,
        },
      };
      const result = Utils.flatObject(input);
      expect(result).toEqual({ 'a.b': 1, 'a.c': 2 });
    });

    test('should flatten a deeply nested object', () => {
      const input = {
        a: {
          b: {
            c: 1,
            d: 2,
          },
          e: 3,
        },
        f: 4,
      };
      const result = Utils.flatObject(input);
      expect(result).toEqual({
        'a.b.c': 1,
        'a.b.d': 2,
        'a.e': 3,
        f: 4,
      });
    });

    test('should handle arrays as objects', () => {
      const input = {
        a: [1, 2, 3],
      };
      const result = Utils.flatObject(input);
      expect(result).toEqual({
        'a.0': 1,
        'a.1': 2,
        'a.2': 3,
      });
    });

    test('should handle mixed values (arrays, objects, primitives)', () => {
      const input = {
        a: 1,
        b: [2, 3],
        c: { d: 4, e: { f: 5 } },
      };
      const result = Utils.flatObject(input);
      expect(result).toEqual({
        a: 1,
        'b.0': 2,
        'b.1': 3,
        'c.d': 4,
        'c.e.f': 5,
      });
    });

    test('should handle null values', () => {
      const input = { a: null };
      const result = Utils.flatObject(input);
      expect(result).toEqual({ a: null });
    });

    test('should handle undefined values', () => {
      const input = { a: undefined };
      const result = Utils.flatObject(input);
      expect(result).toEqual({ a: undefined });
    });
  });
});
