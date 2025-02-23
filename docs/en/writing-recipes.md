# Writing Codx Recipes

This guide explains how to write recipes for Codx.

## Recipe Structure

Recipes are written in YAML format and follow this basic structure:

```yaml
recipe:
  - action1:
    # action parameters
  - action2:
    # action parameters
```

## Recipe Location

Recipes can be:

1. Published as npm packages
2. Stored locally in your project
3. Stored in a central repository

## Recipe Example

Here is a complete example showing how to:

* Install dependencies
* Copy configuration files
* Display information

```yaml
recipe:
  - console.info:
      - text: "Recipe execution starting"

  # Install packages
  - packages.install:
      dependencies:
        - "date-fns"
        - "chalk@^5.4.0"
        - name: express
          exact: true
      devDependencies:
        - prettier
        - "@types/bun@^1.2.0",
        - name: "@types/express"
          exact: true

  # Copy configuration files
  - fs.copy:
      - from: prettierignore
        to: .prettierignore
      - from: config/test.json
        to: config/test.json

  - console.success:
      - text: "Recipe execution completed"
```

## Testing Recipes

Before publishing or sharing your recipe:

1. Test it in a fresh project directory.
2. Verify that all files are copied correctly.
3. Ensure all dependencies are installed.
4. Verify that all actions execute successfully.

## Validating Recipes

Codx validates your recipe before execution to ensure that:

* All required parameters are present.
* File paths are valid.
* Actions are properly formatted.

If validation fails, Codx will display an error message explaining the issue.