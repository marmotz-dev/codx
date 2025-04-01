# Conditions in Codx

This page explains how to use conditions in Codx recipes to execute steps conditionally.

## Introduction to Conditions

Conditions in Codx allow you to execute steps conditionally based on variables previously defined in the recipe. They are evaluated as true or false.

Each step in a recipe can include a `condition` attribute that determines whether the step will be executed or not.

## Condition Syntax

Conditions are written as strings containing expressions that are evaluated using the [filtrex](https://github.com/cshaa/filtrex) library, which allows for secure expression evaluation.

Examples of condition syntax:

```yaml
condition: 'PROJECT_TYPE == "react"'
condition: '"eslint" in SELECTED_TOOLS'
condition: 'INSTALL_TAILWIND == true'
condition: 'not PACKAGE_JSON_EXISTS'
```

## Using Variables in Conditions

Conditions can use all variables defined in the recipe. These variables can be defined by previous actions, especially actions of type `prompt`.

Examples of using variables:

```yaml
- name: "Select tools"
  action:
    type: "prompt"
    promptType: "checkbox"
    message: "Tools to install:"
    choices:
      eslint: "ESLint"
      prettier: "Prettier"
      typescript: "TypeScript"
  variable: "SELECTED_TOOLS"

- name: "Installing ESLint"
  condition: '"eslint" in SELECTED_TOOLS'
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
      - "eslint-plugin-react"
    dev: true
```

In this example, the "Installing ESLint" step will only be executed if the user has selected "ESLint" in the list of tools.

## Operators and Expressions

You can use different operators and expressions in your conditions:

### Comparison Operators

- `==`: equality
- `!=`: inequality
- `>`, `>=`, `<`, `<=`: numerical comparisons

### Logical Operators

- `&&`: logical AND
- `||`: logical OR
- `not`: logical NOT

### Membership Operators

- `in`: checks if a value is present in an array

### Examples of Complex Expressions

```yaml
condition: 'PROJECT_TYPE == "react" && INSTALL_TYPESCRIPT == true'
condition: 'PORT_NUMBER > 3000 || PORT_NUMBER < 1000'
condition: 'not (FRAMEWORK == "angular") && "eslint" in SELECTED_TOOLS'
```

### Comprehensive Documentation

For more information on possible expressions, refer directly to the [filtrex](https://github.com/cshaa/filtrex) documentation.

## Conditions in Messages

You can also use conditions in messages to display text conditionally. The syntax uses template tags:

```yaml
- action:
    type: "message"
    content: |
      🎉 Installation completed successfully!

      Your project is configured with:
      - React
      {{if INSTALL_TAILWIND}}- Tailwind CSS{{/if}}
      {{if "eslint" in SELECTED_TOOLS}}- ESLint{{/if}}
    style: "success"
```

In this example, the lines "- Tailwind CSS" and "- ESLint" will only be displayed if the corresponding conditions are met.

## Best Practices

- Use conditions to avoid executing unnecessary steps
- Make sure variables used in conditions are defined before being used
- Test your conditions with different values to ensure they work as expected
- For complex conditions, consider breaking them down into multiple steps with simpler conditions

## Complete Examples

Here is a complete example of using conditions in a recipe:

```yaml
description: "Setting up a project with optional tools"
author: "Author"

steps:
  - name: "Choose a framework"
    action:
      type: "prompt"
      promptType: "select"
      message: "Framework to use:"
      choices:
        angular: "Angular"
        react: "React"
        vue: "Vue.js"
      defaultValue: "react"
    variable: "FRAMEWORK"

  - name: "Install Tailwind CSS?"
    action:
      type: "prompt"
      promptType: "confirm"
      message: "Do you want to install Tailwind CSS?"
      defaultValue: true
    variable: "INSTALL_TAILWIND"

  - name: "Installing Tailwind CSS"
    condition: 'INSTALL_TAILWIND == true && FRAMEWORK == "angular"'
    action:
      type: "package"
      operation: "install"
      packages:
        - "tailwindcss"
        - "postcss"
        - "autoprefixer"
      dev: true
    onSuccess:
      - action:
          type: "message"
          content: "Tailwind CSS installed successfully!"
          style: "success"
```

In this example, Tailwind CSS will only be installed if the user has chosen to install it and has selected Angular as the framework.

[← Actions](actions.md)