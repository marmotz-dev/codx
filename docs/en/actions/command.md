# Command Action

The `command` action allows you to execute shell commands during the execution of a recipe. This action is useful for
executing system commands, scripts, or command-line tools.

## Parameters

| Parameter | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| `type`    | string | Yes      | Must be `"command"`          |
| `command` | string | Yes      | The shell command to execute |

## Return Value

This action returns an object with the following properties:

| Property | Type   | Always returned | Description                                                   |
|----------|--------|-----------------|---------------------------------------------------------------|
| `code`   | number | Yes             | Return code of the command (0 = success, other value = error) |
| `output` | string | Yes             | The output of the command in the console                      |

## Examples

### Simple Command

```yaml
- action:
    type: "command"
    command: "echo 'Hello, world!'"
```

### Initializing a Git Repository

```yaml
- action:
    type: "command"
    command: "git init"
```

### Running a Script

```yaml
- action:
    type: "command"
    command: "bash ./scripts/setup.sh"
```

## Using with Variables

You can include variables in the command using the syntax `{VARIABLE_NAME}`:

```yaml
- name: "Enter project name"
  action:
    type: "prompt"
    promptType: "text"
    message: "Project name:"
    defaultValue: "my-project"
  variable: "PROJECT_NAME"

- action:
    type: "command"
    command: "mkdir -p {PROJECT_NAME}/src"
```

## Error Handling

If the command fails (non-zero exit code), the action will also fail. You can handle these errors using the `onSuccess`
and `onFailure` attributes:

```yaml
- name: "Check for Node.js"
  action:
    type: "command"
    command: "node --version"
  onSuccess:
    - action:
        type: "message"
        content: "Node.js is installed."
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Node.js is not installed. Installing..."
        style: "warning"
    - action:
        type: "command"
        command: "curl -fsSL https://nodejs.org/install.sh | bash"
```

## Best Practices

- **Portability**: Consider differences between operating systems. Some commands may not work the same way on all
  systems.
- **Error Handling**: Always use `onSuccess` and `onFailure` to handle cases where the command fails.
- **Verbosity**: Add messages to inform the user of what's happening, especially for long-running commands.

## Limitations

- The `command` action executes commands in the system's default shell.
- Interactive commands that require user input will not work properly.
- Commands that modify the shell environment (like `cd`) will not affect subsequent commands. Use the `changeDir` action
  instead to change directories.

## Alternatives

For some common operations, it's better to use specialized actions rather than the `command` action:

- To change directories: use the `changeDir` action
- To manipulate files: use the `fileSystem` action
- To manage packages: use the `package` action

These specialized actions offer better error handling and better portability across operating systems.

[↑ List of Actions](../actions.md)

[← ChangeDir](changeDir.md) ─ [FileSystem →](fileSystem.md)
