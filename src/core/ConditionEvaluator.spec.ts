import { CodxError } from '@/core/CodxError';
import { ConditionEvaluator } from '@/core/ConditionEvaluator';
import { Context } from '@/core/Context';
import { FileNotFoundCodxError } from '@/core/errors/FileNotFoundCodxError';
import { diContainer } from '@/di/Container';
import { beforeEach, describe, expect, it } from 'bun:test';

describe('ConditionEvaluator', () => {
  let evaluator: ConditionEvaluator;
  let context: Context;

  beforeEach(() => {
    evaluator = new ConditionEvaluator();
    context = diContainer.get(Context);
    context.store.clear();
  });

  it('should evaluate true conditions correctly', () => {
    const variables = {
      count: 5,
      name: 'test',
      isActive: true,
      array: ['foo', 'bar'],
    };

    expect(evaluator.evaluate('count > 3', variables)).toBe(true);
    expect(evaluator.evaluate('count < 10', variables)).toBe(true);
    expect(evaluator.evaluate('name == "test"', variables)).toBe(true);
    expect(evaluator.evaluate('isActive', variables)).toBe(true);
    expect(evaluator.evaluate('count > 3 and name == "test"', variables)).toBe(true);
    expect(evaluator.evaluate('"foo" in array', variables)).toBe(true);
  });

  it('should evaluate false conditions correctly', () => {
    const variables = {
      count: 5,
      name: 'test',
      isActive: false,
      array: ['foo', 'bar'],
    };

    expect(evaluator.evaluate('count > 10', variables)).toBe(false);
    expect(evaluator.evaluate('name == "other"', variables)).toBe(false);
    expect(evaluator.evaluate('isActive', variables)).toBe(false);
    expect(evaluator.evaluate('count > 10 or name == "other"', variables)).toBe(false);
    expect(evaluator.evaluate('"baz" in array', variables)).toBe(false);
  });

  it('should handle complex expressions', () => {
    const variables = {
      a: 1,
      b: 2,
      c: 3,
      d: 'test',
    };

    expect(evaluator.evaluate('a + b == c', variables)).toBe(true);
    expect(evaluator.evaluate('a * b < c', variables)).toBe(true);
    expect(evaluator.evaluate('(a + b) * 2 > c', variables)).toBe(true);
    expect(evaluator.evaluate('d == "test" and a + b + c == 6', variables)).toBe(true);
  });

  it('should handle undefined variables', () => {
    const variables = { a: 1 };

    expect(evaluator.evaluate('b == undefined', variables)).toBe(true);
    expect(evaluator.evaluate('a == 1 and b == undefined', variables)).toBe(true);
  });

  it('should return false for invalid expressions', () => {
    const variables = { a: 1 };

    expect(evaluator.evaluate('invalid expression', variables)).toBe(false);
    expect(evaluator.evaluate('a ==', variables)).toBe(false);
    expect(evaluator.evaluate('', variables)).toBe(false);
  });

  it('should handle nested properties through customProp', () => {
    const variables = {
      user: {
        name: 'John',
        age: 30,
        active: true,
      },
    };

    expect(evaluator.evaluate('user.name == "John"', variables)).toBe(true);
    expect(evaluator.evaluate('user.age > 25', variables)).toBe(true);
    expect(evaluator.evaluate('user.active', variables)).toBe(true);
    expect(evaluator.evaluate('user.name == "Jane"', variables)).toBe(false);
  });

  it('should handle empty variables object', () => {
    expect(evaluator.evaluate('true', {})).toBe(true);
    expect(evaluator.evaluate('false', {})).toBe(false);
    expect(evaluator.evaluate('a == 1', {})).toBe(false);
  });

  it('should handle the "instanceOf" function with error classes', () => {
    const baseError = new CodxError('Base error');
    const fileNotFoundError = new FileNotFoundCodxError('/file/path');

    const variables = {
      baseError,
      fileNotFoundError,
    };

    // test success
    expect(evaluator.evaluate('instanceOf(baseError, "CodxError")', variables)).toBe(true);
    expect(evaluator.evaluate('instanceOf(baseError, "Error")', variables)).toBe(true);
    expect(evaluator.evaluate('instanceOf(fileNotFoundError, "FileNotFoundCodxError")', variables)).toBe(true);
    expect(evaluator.evaluate('instanceOf(fileNotFoundError, "CodxError")', variables)).toBe(true);
    expect(evaluator.evaluate('instanceOf(fileNotFoundError, "Error")', variables)).toBe(true);
    expect(evaluator.evaluate('not instanceOf(fileNotFoundError, "Foobar")', variables)).toBe(true);

    // test fails
    expect(evaluator.evaluate('instanceOf(baseError, true)', variables)).toBe(false);
    expect(evaluator.evaluate('instanceOf(baseError, CodxError)', variables)).toBe(false);
  });
});
