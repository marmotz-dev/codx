import { VariablesInterpolator } from '@/core/VariablesInterpolator';
import { diContainer } from '@/di/Container';
import { beforeEach, describe, expect, it } from 'bun:test';

describe('VariablesInterpolator', () => {
  let interpolator: VariablesInterpolator;

  beforeEach(() => {
    diContainer.reset();
    interpolator = diContainer.get(VariablesInterpolator);
  });

  describe('interpolate', () => {
    it('should return input when given empty string', () => {
      expect(interpolator.interpolate('', {})).toBe('');
    });

    it('should return input when given null or undefined', () => {
      const undefinedValue: any = undefined;
      expect(interpolator.interpolate(undefinedValue, {})).toBe(undefinedValue);
      const nullValue: any = null;
      expect(interpolator.interpolate(nullValue, {})).toBe(nullValue);
    });

    it('should replace simple variables', () => {
      const input = 'Hello {name}!';
      const variables = { name: 'World' };
      expect(interpolator.interpolate(input, variables)).toBe('Hello World!');
    });

    it('should replace multiple variables', () => {
      const input = '{greeting} {name}!';
      const variables = { greeting: 'Hello', name: 'World' };
      expect(interpolator.interpolate(input, variables)).toBe('Hello World!');
    });

    it('should handle numeric variables', () => {
      const input = 'Count: {count}';
      const variables = { count: 42 };
      expect(interpolator.interpolate(input, variables)).toBe('Count: 42');
    });

    it('should handle boolean variables', () => {
      const input = 'Status: {active}';
      const variables = { active: true };
      expect(interpolator.interpolate(input, variables)).toBe('Status: true');
    });

    it('should leave variables untouched when not found in the variables object', () => {
      const input = 'Hello {name}!';
      const variables = { greeting: 'Hello' };
      expect(interpolator.interpolate(input, variables)).toBe('Hello {name}!');
    });

    it('should handle nested variables', () => {
      const input = 'Hello {user.name}!';
      const variables = { user: { name: 'World' } };
      expect(interpolator.interpolate(input, variables)).toBe('Hello World!');
    });
  });

  describe('conditional blocks', () => {
    it('should process simple if blocks with truthy value', () => {
      const input = '{{if show}}Content{{/if}}';
      const variables = { show: true };
      expect(interpolator.interpolate(input, variables)).toBe('Content');
    });

    it('should process simple if blocks with falsy value', () => {
      const input = '{{if show}}Content{{/if}}';
      const variables = { show: false };
      expect(interpolator.interpolate(input, variables)).toBe('');
    });

    it('should process if/else blocks', () => {
      const input = '{{if show}}Visible{{else}}Hidden{{/if}}';

      expect(interpolator.interpolate(input, { show: true })).toBe('Visible');
      expect(interpolator.interpolate(input, { show: false })).toBe('Hidden');
    });

    it('should process negated conditions', () => {
      const input = '{{if not show}}Hidden{{else}}Visible{{/if}}';

      expect(interpolator.interpolate(input, { show: true })).toBe('Visible');
      expect(interpolator.interpolate(input, { show: false })).toBe('Hidden');
    });

    it('should process if blocks with comparisons', () => {
      const input = '{{if count > 5}}Many{{else}}Few{{/if}}';

      expect(interpolator.interpolate(input, { count: 10 })).toBe('Many');
      expect(interpolator.interpolate(input, { count: 3 })).toBe('Few');
    });

    it('should process if blocks with equality', () => {
      const input = '{{if status == "active"}}Active{{else}}Inactive{{/if}}';

      expect(interpolator.interpolate(input, { status: 'active' })).toBe('Active');
      expect(interpolator.interpolate(input, { status: 'inactive' })).toBe('Inactive');
    });

    it('should process if blocks with inequality', () => {
      const input = '{{if status != "active"}}Not active{{else}}Active{{/if}}';

      expect(interpolator.interpolate(input, { status: 'active' })).toBe('Active');
      expect(interpolator.interpolate(input, { status: 'inactive' })).toBe('Not active');
    });

    it('should handle nested variables in conditional blocks', () => {
      const input = '{{if show}}Hello {name}!{{else}}No greeting{{/if}}';

      expect(interpolator.interpolate(input, { show: true, name: 'World' })).toBe('Hello World!');
      expect(interpolator.interpolate(input, { show: false, name: 'World' })).toBe('No greeting');
    });

    it('should handle complex nested conditions', () => {
      const input = `
        {{if isLoggedIn}}
          Hello {name}!
          {{if isAdmin}}
            You have admin rights.
          {{else}}
            You have user rights.
          {{/if}}
        {{else}}
          Please log in.
        {{/if}}
      `;

      const adminResult = interpolator
        .interpolate(input, {
          isLoggedIn: true,
          name: 'Admin',
          isAdmin: true,
        })
        .trim();

      const userResult = interpolator
        .interpolate(input, {
          isLoggedIn: true,
          name: 'User',
          isAdmin: false,
        })
        .trim();

      const anonymousResult = interpolator
        .interpolate(input, {
          isLoggedIn: false,
        })
        .trim();

      expect(adminResult).toContain('Hello Admin!');
      expect(adminResult).toContain('You have admin rights.');
      expect(userResult).toContain('Hello User!');
      expect(userResult).toContain('You have user rights.');
      expect(anonymousResult).toBe('Please log in.');
    });
  });

  describe('edge cases', () => {
    it('should handle missing variables gracefully', () => {
      const input = '{{if nonExistent}}Visible{{else}}Hidden{{/if}}';
      expect(interpolator.interpolate(input, {})).toBe('Hidden');
    });

    it('should handle invalid expressions by defaulting to false', () => {
      const input = '{{if 1 + }}Error{{else}}Default{{/if}}';
      expect(interpolator.interpolate(input, {})).toBe('Default');
    });

    it('should process multiple conditional blocks', () => {
      const input = '{{if a}}A{{/if}} {{if b}}B{{/if}} {{if c}}C{{/if}}';
      const variables = { a: true, b: false, c: true };
      expect(interpolator.interpolate(input, variables)).toBe('A  C');
    });
  });
});
