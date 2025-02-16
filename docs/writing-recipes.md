# Writing Codx Recipes

This guide explains how to write recipes for Codx.

## Recipe Structure

Recipes are written in YAML format and follow this basic structure:

```yaml
recipe:
  - step1:
    # step parameters
  - step2:
    # step parameters
```

## Recipe Location

Recipes can be:

1. Published as npm packages
2. Stored locally in your project
3. Stored in a central repository

## Example Recipe

Here's a complete example that shows how to:

* Install dependencies
* Copy configuration files
* Output logs

```yaml
recipe:
  - log:
      - text: "Starting recipe execution"

  # Install packages
  - addPackages:
      dependencies:
        - lodash
        - name: express@^4.18.2"
          exact: true
      devDependencies:
        - "@types/lodash"
        - name: "@types/express@^4.17.17"
          exact: true

  # Copy configuration files
  - copyFiles:
      - from: prettierignore
        to: .prettierignore
      - from: config/test.json
        to: config/test.json

  - log:
      - text: "Recipe execution completed"
```

## Best Practices

1. Group related steps: Keep related commands together (e.g., all package installations in one addPackages command).
2. Use meaningful names: Use clear, descriptive names for files and paths.
3. Version control: Always specify versions for critical dependencies.

## Testing Recipes

Before publishing or sharing your recipe:

1. Test it in a clean project directory
2. Verify all files are copied correctly
3. Ensure all dependencies are installed
4. Check that all steps execute successfully

## Recipe Validation

Codx validates your recipe before execution to ensure:

* All required parameters are present
* File paths are valid
* Steps are properly formatted

If validation fails, Codx will show an error message explaining the issue.