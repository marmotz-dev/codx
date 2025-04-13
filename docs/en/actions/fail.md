# Fail Action

The `fail` action allows you to intentionally raise an error during the execution of a recipe. This action is useful for
stopping the execution of a recipe when a specific condition is not met.

## Parameters

| Parameter | Type   | Required | Description                                                                        |
|-----------|--------|----------|------------------------------------------------------------------------------------|
| `type`    | string | Yes      | Must be `"fail"`                                                                   |
| `message` | string | No       | The error message to display. Default: "Explicit failure triggered by fail action" |

## Return Value

This action does not return a value as it always throws an error.

## Possible Errors

This action intentionally throws the following error:
 
| Error Type                 | Description                                                                                                      |
|----------------------------|------------------------------------------------------------------------------------------------------------------|
| `ExplicitFailureCodxError` | Thrown when the action is executed, with the message provided in the `message` parameter or the default message. |

## Examples

### Simple Failure

```yaml
- action:
    type: "fail"
    message: "Operation aborted by user"
```

### Conditional Failure

```yaml
- name: "Check if Node.js version is compatible"
  action:
    type: "command"
    command: "node --version"
  variable: "NODE_VERSION"
  onSuccess:
    - name: "Fail if Node.js version is too old"
      condition: 'NODE_VERSION.output.trim().substring(1) < "14.0.0"'
      action:
        type: "fail"
        message: "Node.js version must be 14.0.0 or higher"
```

## Using with onFailure

The `fail` action is particularly useful in combination with `onFailure` blocks to implement custom error handling:

```yaml
- name: "Validate configuration"
  action:
    type: "fail"
    message: "Configuration validation failed"
  condition: 'CONFIG_VALID !== true'
  onFailure:
    - action:
        type: "message"
        content: "Configuration is invalid. Using default configuration instead."
        style: "warning"
    - action:
        type: "command"
        command: "cp default-config.json config.json"
```

## Best Practices

- **Clear Error Messages**: Provide descriptive error messages that explain why the failure occurred.
- **Conditional Failures**: Use the `condition` attribute to make failures conditional based on specific criteria.
- **Error Recovery**: Always provide an `onFailure` block when you want to recover from the error and continue
  execution.

## Alternatives

For some scenarios, you might want to consider these alternatives:

- To display a warning without stopping execution: use the `message` action with `style: "warning"`
- To validate conditions without failing: use the `condition` attribute on steps

[↑ List of Actions](../actions.md)

[← Command](command.md) ─ [FileManipulation →](fileManipulation.md)
