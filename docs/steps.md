# Codx Steps Reference

This document details all available steps that can be used in Codx recipes.

## Available Steps

### addPackages

Installs npm packages as dependencies or devDependencies.

#### Parameters

* dependencies: Array of packages to install as dependencies
* devDependencies: Array of packages to install as devDependencies

Each package can be specified in two ways:

1. As a simple string: "package-name"
2. As an object with the following properties:

* name: Package name (required), optionnaly with version
* exact: Boolean to force exact version (optional)

Example :

```yaml
recipe:
  - addPackages:
    dependencies:
      - lodash
      - date-fns@^4.0.0
      - name: express
        exact: true
    devDependencies:
      - "@types/lodash"
      - "@types/express@4.17.17"
```

### copyFiles

Copies files from the recipe directory to your project directory.

#### Parameters

Array of objects with:

* from: Source path (relative to recipe directory)
* to: Destination path (relative to project directory)

Example :

```yaml
recipe:
  - copyFiles:
      - from: config/test.json
        to: config/test.json
```

### log

Outputs messages to the console.

#### Parameters

Array of messages to display

Example:

```yaml
recipe:
  - log:
      - Starting to execute recipe
```