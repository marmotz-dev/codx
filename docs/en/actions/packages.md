# Reference for Actions Related to Package Management

This document details all available actions related to package management that can be used in Codx recipes.

## Package Installation (install)

Installs npm packages as dependencies or devDependencies.

### Parameters

* dependencies: Array of packages to install as dependencies
* devDependencies: Array of packages to install as devDependencies

Each package can be specified in two ways:

1. As a simple string: "package-name"
2. As an object with the following properties:

* name: Package name (required), optionally with a version
* exact: Boolean to enforce an exact version (optional)

Example:

```yaml
recipe:
  - packages.install:
    dependencies:
      - react
      - date-fns@^4.0.0
      - name: express
        exact: true
    devDependencies:
      - "@types/lodash"
      - "@types/express@4.17.17"
```

installs:

* `react` in its latest version in dependencies and will accept future automatic updates (e.g., react@^19.0.0);
* `date-fns` version "^4.0.0" in dependencies;
* `express` in its latest exact version in dependencies and will not accept future automatic updates (e.g.,
  express@4.21.2);