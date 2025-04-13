# FileManipulation Action

The `fileManipulation` action allows you to create and manipulate file content during the execution of a recipe. This
action is essential for creating files, adding content to the beginning or end of files, and updating content using
regular expressions.

## Available Operations

The `fileManipulation` action supports [several operations](#operation-details), each with its own parameters:

1. `append`: [Add content to the end of a file](#append-content-to-a-file)
2. `create`: [Create a file](#create-a-file)
3. `prepend`: [Add content to the beginning of a file](#prepend-content-to-a-file)
4. `update`: [Update content of a file](#update-content-in-a-file)

## Common Parameters

| Parameter   | Type   | Required | Description                                                                |
|-------------|--------|----------|----------------------------------------------------------------------------|
| `type`      | string | Yes      | Must be `"fileManipulation"`                                               |
| `operation` | string | Yes      | The operation to perform (`"create"`, `"prepend"`, `"append"`, `"update"`) |

## Operation Details

### Append Content to a File

The `append` operation allows you to add content to the end of an existing file.

#### Specific Parameters

| Parameter   | Type   | Required | Description                               |
|-------------|--------|----------|-------------------------------------------|
| `operation` | string | Yes      | Must be `"append"`                        |
| `path`      | string | Yes      | The path of the file to append content to |
| `content`   | string | Yes      | The content to add to the end of the file |

#### Return Value

This operation returns an object with the following properties:

| Property   | Type    | Always returned | Description                                |
|------------|---------|-----------------|--------------------------------------------|
| `path`     | string  | Yes             | Absolute path of the modified file         |
| `appended` | boolean | Yes             | Indicates whether the content was appended |

#### Example

```yaml
- action:
    type: "fileManipulation"
    operation: "append"
    path: "CHANGELOG.md"
    content: |

      ## v1.0.0 (2023-10-15)

      - Initial release
```

### Create a File

The `create` operation allows you to create a new file with specified content.

#### Specific Parameters

| Parameter   | Type    | Required | Default Value | Description                                         |
|-------------|---------|----------|---------------|-----------------------------------------------------|
| `operation` | string  | Yes      | -             | Must be `"create"`                                  |
| `path`      | string  | Yes      | -             | The path of the file to create                      |
| `content`   | string  | No       | -             | The content to write to the file                    |
| `overwrite` | boolean | No       | `false`       | If `true`, overwrites the file if it already exists |

#### Return Value

This operation returns an object with the following properties:

| Property      | Type    | Always returned | Description                                       |
|---------------|---------|-----------------|---------------------------------------------------|
| `path`        | string  | Yes             | Absolute path of the new file                     |
| `overwritten` | boolean | Yes             | Indicates whether the file was overwritten or not |

#### Example

```yaml
- action:
    type: "fileManipulation"
    operation: "create"
    path: ".eslintrc.json"
    content: |
      {
        "extends": ["react-app", "prettier"],
        "plugins": ["react"],
        "rules": {
          "react/jsx-uses-react": "error",
          "react/jsx-uses-vars": "error"
        }
      }
    overwrite: true
```

### Prepend Content to a File

The `prepend` operation allows you to add content to the beginning of an existing file.

#### Specific Parameters

| Parameter   | Type   | Required | Description                                     |
|-------------|--------|----------|-------------------------------------------------|
| `operation` | string | Yes      | Must be `"prepend"`                             |
| `path`      | string | Yes      | The path of the file to prepend content to      |
| `content`   | string | Yes      | The content to add to the beginning of the file |

#### Return Value

This operation returns an object with the following properties:

| Property    | Type    | Always returned | Description                                 |
|-------------|---------|-----------------|---------------------------------------------|
| `path`      | string  | Yes             | Absolute path of the modified file          |
| `prepended` | boolean | Yes             | Indicates whether the content was prepended |

#### Example

```yaml
- action:
    type: "fileManipulation"
    operation: "prepend"
    path: "README.md"
    content: |
      # Project Documentation

      This documentation was automatically generated.

```

### Update Content in a File

The `update` operation allows you to replace content in a file using a regular expression pattern.

#### Specific Parameters

| Parameter   | Type   | Required | Description                                     |
|-------------|--------|----------|-------------------------------------------------|
| `operation` | string | Yes      | Must be `"update"`                              |
| `path`      | string | Yes      | The path of the file to update                  |
| `pattern`   | string | Yes      | The regular expression pattern to search for    |
| `content`   | string | Yes      | The content to replace the matched pattern with |

#### Return Value

This operation returns an object with the following properties:

| Property  | Type    | Always returned | Description                                               |
|-----------|---------|-----------------|-----------------------------------------------------------|
| `path`    | string  | Yes             | Absolute path of the modified file                        |
| `updated` | boolean | Yes             | Indicates whether any content was updated (pattern found) |

#### Example

```yaml
- action:
    type: "fileManipulation"
    operation: "update"
    path: "package.json"
    pattern: "\"version\": \"[0-9]+\\.[0-9]+\\.[0-9]+\""
    content: "\"version\": \"1.2.0\""
```

### Using with Variables

All paths and content in the different operations can use variable interpolation to make the action dynamic, using the
syntax `{VARIABLE_NAME}`.

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
    type: "fileManipulation"
    operation: "create"
    path: "README.md"
    content: |
      # {PROJECT_NAME}

      This project was created with Codx.
```

### Error Handling

You can handle errors that may occur during file operations using the `onSuccess` and `onFailure` attributes:

```yaml
- name: "Update version in package.json"
  action:
    type: "fileManipulation"
    operation: "update"
    path: "package.json"
    pattern: "\"version\": \"[0-9]+\\.[0-9]+\\.[0-9]+\""
    content: "\"version\": \"1.2.0\""
  onSuccess:
    - action:
        type: "message"
        content: "Version updated successfully."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Failed to update version. Pattern not found or file doesn't exist."
        style: "error"
```

#### Possible Errors

This action can throw the following errors:
 
| Error Type                     | Description                                                                                              |
|--------------------------------|----------------------------------------------------------------------------------------------------------|
| `UnknownOperationCodxError`    | Thrown when an unknown operation is specified.                                                           |
| `FileNotFoundCodxError`        | Thrown when the file to be manipulated doesn't exist (for `append`, `prepend`, and `update` operations). |
| `FileAlreadyExistsCodxError`   | Thrown when trying to create a file that already exists without the `overwrite` option.                  |
| `InvalidRegexPatternCodxError` | Thrown when the regex pattern for the `update` operation is invalid.                                     |

### Best Practices

- **File Existence**: For `prepend`, `append`, and `update` operations, make sure the file exists before attempting to
  modify it.
- **Backup**: Make a backup copy of important files before modifying them.
- **Relative Paths**: Use relative paths rather than absolute paths for better portability.
- **Overwrite Parameter**: Be careful with the `overwrite: true` parameter in the `create` operation, as it can
  overwrite existing files without warning.
- **Regular Expressions**: Test your regular expressions carefully for the `update` operation to ensure they match the
  intended content.
- **Error Handling**: Always use `onSuccess` and `onFailure` to handle cases where operations fail.

### Common Use Cases

#### Adding License Headers to Files

```yaml
- action:
    type: "fileManipulation"
    operation: "prepend"
    path: "src/index.js"
    content: |
      /**
       * Copyright (c) 2023 My Company
       * Licensed under the MIT License
       */

```

#### Updating Version Numbers

```yaml
- action:
    type: "fileManipulation"
    operation: "update"
    path: "package.json"
    pattern: "\"version\": \"[0-9]+\\.[0-9]+\\.[0-9]+\""
    content: "\"version\": \"{NEW_VERSION}\""
```

#### Adding Content to Documentation

```yaml
- action:
    type: "fileManipulation"
    operation: "append"
    path: "CHANGELOG.md"
    content: |

      ## v{VERSION} ({RELEASE_DATE})

      {CHANGELOG_CONTENT}
```

[↑ List of Actions](../actions.md)

[← Fail](fail.md) ─ [FileSystem →](fileSystem.md)
