# FileSystem Action

The `fileSystem` action allows you to manipulate files and directories during the execution of a recipe. This action is
essential for creating, modifying, copying, moving, or deleting files and directories as part of automating project
configuration.

## Available Operations

The `fileSystem` action supports [several operations](#operation-details), each with its own parameters:

1. `copy`: [Copy a file or directory](#copy-a-file-or-directory)
2. `delete`: [Delete a file or directory](#delete-a-file-or-directory)
3. `exists`: [Check if a file or directory exists](#check-if-a-file-or-directory-exists)
4. `mkdir`: [Create a directory](#create-a-directory)
5. `move`: [Move a file or directory](#move-a-file-or-directory)

> **Note**: For file content manipulation operations like creating files, adding content to files, or updating content
> with regular expressions, see the [FileManipulation](fileManipulation.md) action.

## Common Parameters

| Parameter   | Type   | Required | Description                                                                      |
|-------------|--------|----------|----------------------------------------------------------------------------------|
| `type`      | string | Yes      | Must be `"fileSystem"`                                                           |
| `operation` | string | Yes      | The operation to perform (`"delete"`, `"exists"`, `"mkdir"`, `"copy"`, `"move"`) |

## Operation Details

### Copy a File or Directory

The `copy` operation allows you to copy a file or directory.

#### Specific Parameters

| Parameter     | Type    | Required | Default Value | Description                                              |
|---------------|---------|----------|---------------|----------------------------------------------------------|
| `operation`   | string  | Yes      | -             | Must be `"copy"`                                         |
| `source`      | string  | Yes      | -             | The source path of the file or directory to copy         |
| `destination` | string  | Yes      | -             | The destination path where to copy the file or directory |
| `overwrite`   | boolean | No       | `false`       | If `true`, overwrites existing files at the destination  |

#### Return Value

This operation returns an object with the following properties:

| Property      | Type    | Always returned | Description                                                    |
|---------------|---------|-----------------|----------------------------------------------------------------|
| `source`      | string  | Yes             | Absolute path of the file or directory to copy                 |
| `destination` | string  | Yes             | Absolute path of the copied file or directory                  |
| `overwritten` | boolean | Yes             | Indicates whether the file or directory was overwritten or not |

#### Example

```yaml
- action:
    type: "fileSystem"
    operation: "copy"
    source: "templates/react"
    destination: "src"
    overwrite: true
```

#### Variables and Interpolation

The `source` and `destination` paths can use variable interpolation to make the action dynamic.

Additionally, you can use 2 internal variables to access the recipe directory (`$RECIPE_DIRECTORY`) and the current
project directory (`$PROJECT_DIRECTORY`).

For example, if there are template files in your recipe directory and you want to copy them to your project, you can do
something like this:

```yaml
- action:
    type: "fileSystem"
    operation: "copy"
    source: "{$RECIPE_DIRECTORY}/templates/.eslintrc.json"
    destination: "{$PROJECT_DIRECTORY}/.eslintrc.json"
    overwrite: true
```

### Delete a File or Directory

The `delete` operation allows you to delete a file or directory.

#### Specific Parameters

| Parameter   | Type   | Required | Description                                 |
|-------------|--------|----------|---------------------------------------------|
| `operation` | string | Yes      | Must be `"delete"`                          |
| `path`      | string | Yes      | The path of the file or directory to delete |

#### Return Value

This operation returns an object with the following properties:

| Property  | Type    | Always returned | Description                                               |
|-----------|---------|-----------------|-----------------------------------------------------------|
| `path`    | string  | Yes             | Absolute path of the deleted file                         |
| `deleted` | boolean | Yes             | Indicates whether the file existed and was deleted or not |

#### Example

```yaml
- action:
    type: "fileSystem"
    operation: "delete"
    path: "node_modules"
```

### Check if a File or Directory Exists

The `exists` operation allows you to check if a file or directory exists.

#### Specific Parameters

| Parameter   | Type   | Required | Description                                |
|-------------|--------|----------|--------------------------------------------|
| `operation` | string | Yes      | Must be `"exists"`                         |
| `path`      | string | Yes      | The path of the file or directory to check |

#### Return Value

This operation returns an object with the following properties:

| Property | Type    | Always returned | Description                              |
|----------|---------|-----------------|------------------------------------------|
| `path`   | string  | Yes             | Absolute path of the tested file         |
| `exists` | boolean | Yes             | Indicates whether the file exists or not |

#### Example

```yaml
- action:
    type: "fileSystem"
    operation: "exists"
    path: "package.json"
  variable: "PACKAGE_JSON_EXISTS"
```

### Create a Directory

The `mkdir` operation allows you to create a new directory.

#### Specific Parameters

| Parameter   | Type   | Required | Description                         |
|-------------|--------|----------|-------------------------------------|
| `operation` | string | Yes      | Must be `"mkdir"`                   |
| `path`      | string | Yes      | The path of the directory to create |

#### Return Value

This operation returns an object with the following properties:

| Property  | Type    | Always returned | Description                                        |
|-----------|---------|-----------------|----------------------------------------------------|
| `path`    | string  | Yes             | Absolute path of the directory to create           |
| `created` | boolean | Yes             | Indicates whether the directory was created or not |

#### Example

```yaml
- action:
    type: "fileSystem"
    operation: "mkdir"
    path: "src/components"
```

### Move a File or Directory

The `move` operation allows you to move a file or directory.

#### Specific Parameters

| Parameter     | Type    | Required | Default Value | Description                                              |
|---------------|---------|----------|---------------|----------------------------------------------------------|
| `operation`   | string  | Yes      | -             | Must be `"move"`                                         |
| `source`      | string  | Yes      | -             | The source path of the file or directory to move         |
| `destination` | string  | Yes      | -             | The destination path where to move the file or directory |
| `overwrite`   | boolean | No       | `false`       | If `true`, overwrites existing files at the destination  |

#### Return Value

This operation returns an object with the following properties:

| Property      | Type    | Always returned | Description                                                    |
|---------------|---------|-----------------|----------------------------------------------------------------|
| `source`      | string  | Yes             | Absolute path of the file or directory to move                 |
| `destination` | string  | Yes             | Absolute path of the moved file or directory                   |
| `overwritten` | boolean | Yes             | Indicates whether the file or directory was overwritten or not |

#### Example

```yaml
- action:
    type: "fileSystem"
    operation: "move"
    source: "old-dir"
    destination: "new-dir"
    overwrite: true
```

### Using with Variables

All paths in the different operations (`path`, `source`, `destination`) can use variable interpolation to make the
action dynamic, using the syntax `{VARIABLE_NAME}`.

Additionally, you can use 2 internal variables to access the recipe directory (`$RECIPE_DIRECTORY`) and the current
project directory (`$PROJECT_DIRECTORY`).

You can also use variables in the content of files:

```yaml
- name: "Enter project name"
  action:
    type: "prompt"
    promptType: "text"
    message: "Project name:"
    defaultValue: "my-project"
  variable: "PROJECT_NAME"

- action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}"

- action:
    type: "fileSystem"
    operation: "create"
    path: "{PROJECT_NAME}/README.md"
    content: |
      # {PROJECT_NAME}

      This project was created with Codx.
```

### Error Handling

You can handle errors that may occur during file operations using the `onSuccess` and `onFailure` attributes:

```yaml
- name: "Create configuration file"
  action:
    type: "fileSystem"
    operation: "create"
    path: ".eslintrc.json"
    content: |
      {
        "extends": ["react-app", "prettier"]
      }
    overwrite: false
  onSuccess:
    - action:
        type: "message"
        content: "Configuration file created successfully."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "The file already exists and will not be overwritten."
        style: "warning"
```

#### Possible Errors

This action can throw the following errors:
 
| Error Type                              | Description                                                                                |
|-----------------------------------------|--------------------------------------------------------------------------------------------|
| `UnknownOperationCodxError`             | Thrown when an unknown operation is specified.                                             |
| `MissingSourcePathCodxError`            | Thrown when the source path is missing for `copy` or `move` operations.                    |
| `MissingDestinationPathCodxError`       | Thrown when the destination path is missing for `copy` or `move` operations.               |
| `OutsideSourceFileCodxError`            | Thrown when the source file is outside the project or recipe directory.                    |
| `DestinationFileAlreadyExistsCodxError` | Thrown when the destination file already exists and the `overwrite` option is not enabled. |
| `SourceFileNotFoundCodxError`           | Thrown when the source file doesn't exist.                                                 |
| `DirectoryCreationCodxError`            | Thrown when there's an error creating a directory.                                         |

### Best Practices

- **Prior Verification**: Use the `exists` operation to check if a file or directory exists before manipulating it.
- **Backup**: Make a backup copy of important files before modifying them.
- **Relative Paths**: Use relative paths rather than absolute paths for better portability.
- **Overwrite Parameter**: Be careful with the `overwrite: true` parameter, as it can overwrite existing files without
  warning.
- **Error Handling**: Always use `onSuccess` and `onFailure` to handle cases where operations fail.

### Common Use Cases

#### Creating a Project Structure

```yaml
- action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}"

- action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}/src"

- action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}/public"

- action:
    type: "fileSystem"
    operation: "create"
    path: "{PROJECT_NAME}/src/index.js"
    content: |
      import React from 'react';
      import ReactDOM from 'react-dom';
      import App from './App';

      ReactDOM.render(<App />, document.getElementById('root'));
```

#### Copying Templates

```yaml
- action:
    type: "fileSystem"
    operation: "copy"
    source: "{$RECIPE_DIRECTORY}/templates/react-component"
    destination: "{PROJECT_NAME}/src/components"
```

#### Conditional File Modification

```yaml
- action:
    type: "fileSystem"
    operation: "exists"
    path: "package.json"
  variable: "PACKAGE_JSON_EXISTS"

- condition: "not PACKAGE_JSON_EXISTS"
  action:
    type: "fileSystem"
    operation: "create"
    path: "package.json"
    content: |
      {
        "name": "{PROJECT_NAME}",
        "version": "1.0.0",
        "dependencies": {}
      }
```

[↑ List of Actions](../actions.md)

[← FileManipulation](fileManipulation.md) ─ [Message →](message.md)
