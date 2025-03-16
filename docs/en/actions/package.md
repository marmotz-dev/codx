# Package Action

The `package` action allows you to manage dependencies and packages in your project. This action is essential for
automating the installation, removal, updating, and checking of packages, as well as for running packages.

## Available Operations

The `package` action supports several operations, each with its own parameters:

1. `install`: [Install packages](#install-packages)
2. `remove`: [Remove packages](#remove-packages)
3. `update`: [Update packages](#update-packages)
4. `check`: [Check packages](#check-packages)
5. `run`: [Run a package](#run-a-package)

## Common Parameters

| Parameter   | Type   | Required | Description                                                                        |
|-------------|--------|----------|------------------------------------------------------------------------------------|
| `type`      | string | Yes      | Must be `"package"`                                                                |
| `operation` | string | Yes      | The operation to perform (`"install"`, `"remove"`, `"update"`, `"check"`, `"run"`) |

## Operation Details

### Check Packages

The `check` operation allows you to check if certain packages are installed and if their versions meet the specified
criteria.

#### Specific Parameters

| Parameter   | Type   | Required | Description                                       |
|-------------|--------|----------|---------------------------------------------------|
| `operation` | string | Yes      | Must be `"check"`                                 |
| `packages`  | array  | Yes      | Array of objects describing the packages to check |

Each object in the `packages` array must have the following properties:

| Property     | Type   | Required | Description                              |
|--------------|--------|----------|------------------------------------------|
| `package`    | string | Yes      | Name of the package to check             |
| `minVersion` | string | No       | Minimum required version (semver format) |
| `maxVersion` | string | No       | Maximum required version (semver format) |

#### Return Value

This operation returns an object with the following properties:

| Property        | Type    | Always returned                                 | Description                                                                                        |
|-----------------|---------|-------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `check`         | boolean | Yes                                             | Indicates whether the package is installed and passes the `minVersion` and `maxVersion` conditions |
| `installed`     | boolean | Yes                                             | Indicates whether the package is installed or not                                                  |
| `version`       | string  | Only if installed                               | Indicates the current version of the package                                                       |
| `hasMinVersion` | boolean | Only if installed and `minVersion` is specified | Indicates whether the package passes the `minVersion` condition                                    |
| `hasMaxVersion` | boolean | Only if installed and `maxVersion` is specified | Indicates whether the package passes the `maxVersion` condition                                    |

#### Example

```yaml
- name: "Check React and TypeScript versions"
  action:
    type: "package"
    operation: "check"
    packages:
      - package: "react"
        minVersion: "17.0.0"
        maxVersion: "18.0.0"
      - package: "typescript"
        minVersion: "4.0.0"
  variable: "PACKAGES_CHECK_RESULT"
```

### Install Packages

The `install` operation allows you to install one or more packages.

#### Specific Parameters

| Parameter   | Type    | Required | Default Value | Description                                                  |
|-------------|---------|----------|---------------|--------------------------------------------------------------|
| `operation` | string  | Yes      | -             | Must be `"install"`                                          |
| `packages`  | array   | Yes      | -             | Array of packages to install                                 |
| `dev`       | boolean | No       | `false`       | If `true`, installs the packages as development dependencies |

#### Return Value

This operation returns an object with the following properties:

| Property | Type   | Always returned | Description                                                   |
|----------|--------|-----------------|---------------------------------------------------------------|
| `code`   | number | Yes             | Return code of the command (0 = success, other value = error) |
| `output` | string | Yes             | The output of the command in the console                      |

#### Example

```yaml
- name: "Install React and React DOM"
  action:
    type: "package"
    operation: "install"
    packages:
      - "react@19"
      - "react-dom"
```

#### Example with Development Dependencies

```yaml
- name: "Install ESLint and Prettier"
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
      - "prettier"
      - "eslint-config-prettier"
    dev: true
```

### Remove Packages

The `remove` operation allows you to remove one or more packages.

#### Specific Parameters

| Parameter   | Type   | Required | Description                 |
|-------------|--------|----------|-----------------------------|
| `operation` | string | Yes      | Must be `"remove"`          |
| `packages`  | array  | Yes      | Array of packages to remove |

#### Return Value

This operation returns an object with the following properties:

| Property | Type   | Always returned | Description                                                   |
|----------|--------|-----------------|---------------------------------------------------------------|
| `code`   | number | Yes             | Return code of the command (0 = success, other value = error) |
| `output` | string | Yes             | The output of the command in the console                      |

#### Example

```yaml
- name: "Remove Lodash"
  action:
    type: "package"
    operation: "remove"
    packages:
      - "lodash"
```

### Run a Package

The `run` operation allows you to run a package.

#### Specific Parameters

| Parameter   | Type   | Required | Description                    |
|-------------|--------|----------|--------------------------------|
| `operation` | string | Yes      | Must be `"run"`                |
| `package`   | string | Yes      | Name of the package to run     |
| `options`   | string | No       | Options to pass to the package |

#### Return Value

This operation returns an object with the following properties:

| Property | Type   | Always returned | Description                                                   |
|----------|--------|-----------------|---------------------------------------------------------------|
| `code`   | number | Yes             | Return code of the command (0 = success, other value = error) |
| `output` | string | Yes             | The output of the command in the console                      |

#### Example

```yaml
- name: "Create a React project"
  action:
    type: "package"
    operation: "run"
    package: "create-react-app"
    options: "{PROJECT_NAME}"
```

### Update Packages

The `update` operation allows you to update one or more packages.

#### Specific Parameters

| Parameter   | Type   | Required | Description                 |
|-------------|--------|----------|-----------------------------|
| `operation` | string | Yes      | Must be `"update"`          |
| `packages`  | array  | Yes      | Array of packages to update |

#### Return Value

This operation returns an object with the following properties:

| Property | Type   | Always returned | Description                                                   |
|----------|--------|-----------------|---------------------------------------------------------------|
| `code`   | number | Yes             | Return code of the command (0 = success, other value = error) |
| `output` | string | Yes             | The output of the command in the console                      |

#### Example

```yaml
- name: "Update React and React DOM"
  action:
    type: "package"
    operation: "update"
    packages:
      - "react"
      - "react-dom"
```

### Using with Variables

You can use variables in package names and options using the syntax `{VARIABLE_NAME}`:

```yaml
- name: "Select packages"
  action:
    type: "prompt"
    promptType: "checkbox"
    message: "Which packages would you like to install?"
    choices:
      react: "React"
      vue: "Vue.js"
      angular: "Angular"
    defaultValues:
      - react
  variable: "SELECTED_PACKAGES"

- name: "Install React"
  condition: '"react" in SELECTED_PACKAGES'
  action:
    type: "package"
    operation: "install"
    packages:
      - "react"
      - "react-dom"
```

### Error Handling

You can handle errors that may occur during package operations using the `onSuccess` and `onFailure` attributes:

```yaml
- name: "Install TypeScript"
  action:
    type: "package"
    operation: "install"
    packages:
      - "typescript"
    dev: true
  onSuccess:
    - action:
        type: "message"
        content: "TypeScript installed successfully."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Failed to install TypeScript. Check your internet connection."
        style: "error"
```

### Package Manager Detection

Codx automatically detects which package manager to use (npm, yarn, pnpm, bun) based on the system. You can also
explicitly specify the package manager to use by using the --pm option when running the recipe:

```shell
bunx codx run ./path/to/recipe.yml --pm yarn
```

### Best Practices

- **Specific Versions**: Specify precise versions for critical packages to avoid compatibility issues.
- **Development Dependencies**: Use `dev: true` for packages that are only needed during development.
- **Prior Verification**: Use the `check` operation to verify if packages are already installed before installing them.
- **Error Handling**: Always use `onSuccess` and `onFailure` to handle cases where operations fail.
- **Grouping**: Group installations of related packages in a single action to improve performance.

### Common Use Cases

#### Installing a Frontend Framework

```yaml
- name: "Install React and its dependencies"
  action:
    type: "package"
    operation: "install"
    packages:
      - "react"
      - "react-dom"
      - "react-scripts"
```

#### Setting Up a Development Environment

```yaml
- name: "Install development tools"
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
      - "prettier"
      - "typescript"
      - "jest"
    dev: true
```

#### Creating a New Project

```yaml
- name: "Create a React project"
  action:
    type: "package"
    operation: "run"
    package: "create-react-app"
    options: "{PROJECT_NAME}"
  onSuccess:
    - action:
        type: "message"
        content: "React project created successfully!"
        style: "success"
```

[↑ List of Actions](../actions.md)

[← Message](message.md) ─ [Prompt →](prompt.md)
