# ChangeDir Action

The `changeDir` action allows you to change the current project directory during the execution of a recipe. This action
is useful when you need to execute commands or perform operations in a specific directory.

The directory change is permanent, unlike the `workingDirectory` configuration which only affects the current action.

## Parameters

| Parameter | Type   | Required | Description                            |
|-----------|--------|----------|----------------------------------------|
| `type`    | string | Yes      | Must be `"changeDir"`                  |
| `path`    | string | Yes      | The path of the directory to change to |

## Return Value

This action does not return any value since the current project directory is always accessible via the following
variables:

* `$PROJECT_DIRECTORY`: absolute path of the current project directory
* `$RELATIVE_PROJECT_DIRECTORY`: path relative to the Codx execution path of the current project directory

## Examples

### Change to a Specific Directory

```yaml
- action:
    type: "changeDir"
    path: "my-project"
```

### Change to a Parent Directory

```yaml
- action:
    type: "changeDir"
    path: ".."
```

### Change to an Absolute Path

```yaml
- action:
    type: "changeDir"
    path: "/home/user/projects/my-project"
```

## Using with Variables

You can use variables in the path using the syntax `{VARIABLE_NAME}`:

```yaml
- name: "Enter project name"
  action:
    type: "prompt"
    promptType: "text"
    message: "Project name:"
    defaultValue: "my-project"
  variable: "PROJECT_NAME"

- action:
    type: "changeDir"
    path: "{PROJECT_NAME}"
```

## Error Handling

If the specified directory does not exist or is not accessible, the action will fail. You can handle these errors using
the `onSuccess` and `onFailure` attributes:

```yaml
- name: "Change to project directory"
  action:
    type: "changeDir"
    path: "{PROJECT_NAME}"
  onSuccess:
    - action:
        type: "message"
        content: "Directory changed successfully."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "The directory does not exist. Creating it..."
        style: "warning"
    - action:
        type: "fileSystem"
        operation: "mkdir"
        path: "{PROJECT_NAME}"
    - action:
        type: "changeDir"
        path: "{PROJECT_NAME}"
```

### Possible Errors

This action can throw the following errors:

| Error Type                      | Description                                                                                                   |
|---------------------------------|---------------------------------------------------------------------------------------------------------------|
| `MissingDirectoryPathCodxError` | Thrown when the `path` parameter is missing.                                                                  |
| `DirectoryChangeCodxError`      | Thrown when there's an error changing the directory (e.g., the directory doesn't exist or is not accessible). |
 
## Best Practices

- **Prior Verification**: Check that the directory exists before trying to access it, or use `onFailure` to handle the
  case where it doesn't exist.
- **Relative Paths**: Use relative paths rather than absolute paths for better portability.
- **Return to Initial Directory**: If you change directories for a temporary operation, don't forget to return to the
  initial directory afterward.

## Common Use Cases

### Creating a Project and Navigating to Its Directory

```yaml
- name: "Create a React project"
  action:
    type: "package"
    operation: "run"
    package: "create-react-app"
    options: "{PROJECT_NAME}"

- name: "Navigate to the project directory"
  action:
    type: "changeDir"
    path: "{PROJECT_NAME}"
```

### Executing Commands in a Specific Directory

In this case, it's better to use the `workingDirectory` configuration option:

```yaml
- name: "Install dependencies"
  action:
    type: "command"
    command: "npm install"
  workingDirectory: "front"
```

[↑ List of Actions](../actions.md)

[Command →](command.md)
