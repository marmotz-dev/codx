# Error Handling in Codx

This page explains how errors are handled in Codx and how to use the named error classes in your recipes.

## Introduction to Error Handling

Codx uses a system of named error classes to make it easier to identify and handle specific types of errors in your
recipes. Each error class extends the base `CodxError` class and has a specific name that indicates the type of error.

Refer to the documentation for each action to find out what errors it returns.

## Using Error Types in Conditions

You can use the `instanceOf` function to check if an error is of a specific type in your recipe conditions. This is
particularly useful in `onFailure` blocks to handle specific types of errors differently.

Example:

```yaml
steps:
  - name: "Install package"
    action:
      type: "package"
      operation: "install"
      packages:
        - "some-package"
    onFailure:
      - name: "Handle package manager not found"
        condition: 'instanceOf(error, "PackageManagerNotFoundCodxError")'
        action:
          type: "message"
          content: "Package manager not found. Please install npm or yarn."
          style: "error"

      - name: "Handle other errors"
        condition: 'not instanceOf(error, "PackageManagerNotFoundCodxError")'
        action:
          type: "message"
          content: "An error occurred: {{error.message}}"
          style: "error"
```

In this example, if the package installation fails because the package manager is not found, a specific error message is
displayed. For all other types of errors, a generic error message is displayed with the error message.

## Best Practices

- Use specific error types in your `onFailure` blocks to handle different types of errors differently
- Use the `instanceOf` function to check for specific error types
- Provide clear error messages to help users understand what went wrong
- Always handle errors in your recipes to provide a better user experience

[← Conditions](conditions.md)