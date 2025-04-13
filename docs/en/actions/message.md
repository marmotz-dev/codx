# Message Action

The `message` action allows you to display messages to the user during the execution of a recipe. This action is useful
for providing information, instructions, or feedback on the progress of the recipe.

## Parameters

| Parameter | Type   | Required | Default Value | Description                           |
|-----------|--------|----------|---------------|---------------------------------------|
| `type`    | string | Yes      | -             | Must be `"message"`                   |
| `content` | string | Yes      | -             | The content of the message to display |
| `style`   | string | No       | `"default"`   | The style of the message              |

### Available Styles

- `"default"`: Default style
- `"header"`: Style for titles or headers
- `"info"`: Style for general information
- `"success"`: Style for success messages
- `"warning"`: Style for warnings
- `"error"`: Style for errors

## Return Value

This action returns an object with the following properties:

| Property  | Type   | Always returned | Description                |
|-----------|--------|-----------------|----------------------------|
| `message` | string | Yes             | Displayed message          |
| `style`   | string | Yes             | Style used for the message |

## Possible Errors

This action can throw the following errors:
 
| Error Type                | Description                                     |
|---------------------------|-------------------------------------------------|
| `MissingContentCodxError` | Thrown when the `content` parameter is missing. |

## Examples

### Default Message

```yaml
- action:
    type: "message"
    content: "Installation in progress..."
```

This produces the following message:

```shell
Installation in progress...
```

### Title Message

```yaml
- action:
    type: "message"
    content: "Project Installation"
    style: "header"
```

This produces the following message:

```shell
# Project Installation
```

### Information Message

```yaml
- action:
    type: "message"
    content: "Installation in progress..."
    style: "info"
```

This produces the following message:

```shell
ℹ Installation in progress...
```

### Success Message

```yaml
- action:
    type: "message"
    content: "Installation completed successfully!"
    style: "success"
```

This produces the following message:

```shell
✓ Installation completed successfully!
```

### Warning Message

```yaml
- action:
    type: "message"
    content: "Configuration file missing. Creating a new file."
    style: "warning"
```

This produces the following message:

```shell
⚠ Configuration file missing. Creating a new file.
```

### Error Message

```yaml
- action:
    type: "message"
    content: "Error during installation. Please check your internet connection."
    style: "error"
```

This produces the following message:

```shell
✗ Error during installation. Please check your internet connection.
```

## Using with Variables

You can include variables in the message content using the syntax `{VARIABLE_NAME}`:

```yaml
- name: "Enter project name"
  action:
    type: "prompt"
    promptType: "text"
    message: "Project name:"
    defaultValue: "my-project"
  variable: "PROJECT_NAME"

- action:
    type: "message"
    content: "Creating project {PROJECT_NAME} in progress..."
    style: "info"
```

## Using with Conditions

You can use conditions in the message content with the template syntax:

```yaml
- action:
    type: "message"
    content: |
      Installation completed!

      Your project includes:
      - React
      {{if INSTALL_TAILWIND}}
      - Tailwind CSS
      {{/if}}
      {{if INSTALL_TYPESCRIPT}}
      - TypeScript
      {{/if}}
    style: "success"
```

## Best Practices

- Use messages with the `"header"` style to indicate the beginning of a new section or important step
- Use messages with the `"info"` style to provide additional information or instructions
- Use messages with the `"success"` style to confirm that an operation has completed successfully
- Use messages with the `"warning"` style to warn the user of potentially problematic situations
- Use messages with the `"error"` style to report problems that require the user's attention

[↑ List of Actions](../actions.md)

[← FileSystem](fileSystem.md) ─ [Package →](package.md)
