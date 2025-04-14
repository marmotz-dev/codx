# Variables and Interpolation in Codx

This page explains how to use variables and interpolation in Codx recipes to store and reuse values.

## Introduction to Variables

Variables in Codx allow you to store values that can be reused in different parts of your recipe. They are particularly
useful for:

- Storing user inputs
- Reusing values across multiple steps
- Making your recipes dynamic and adaptable
- Making conditional decisions

## Defining Variables

Variables are defined using the `variable` attribute in a step. The return value of the action is then stored in the
specified variable.

Example of defining a variable:

```yaml
- name: "Enter project name"
  action:
    type: "prompt"
    promptType: "text"
    message: "Project name:"
    defaultValue: "my-project"
  variable: "PROJECT_NAME"
```

In this example, the user's response to the prompt is stored in the `PROJECT_NAME` variable.

## Variable Types

Variables can contain different types of values, depending on the action that defines them:

* a string in most actions,
* a number, for example for the prompt.number action,
* an array of strings, for example for the prompt.checkbox action,
* a boolean, for example for the fileSystem.exists action.

## Interpolation in Strings

Interpolation allows you to insert the value of a variable into a string. In Codx, interpolation uses the syntax
`{VARIABLE_NAME}`.

Example of interpolation:

```yaml
- name: "Create project directory"
  action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}"
```

In this example, `{PROJECT_NAME}` will be replaced by the value of the `PROJECT_NAME` variable.

Interpolation works in most string-type fields in recipes, including:

- File and directory paths
- Messages displayed to the user
- Shell commands
- File contents

### Examples of Interpolation in Different Contexts

#### In File Paths

```yaml
- name: "Create a configuration file"
  action:
    type: "fileSystem"
    operation: "create"
    path: "{PROJECT_NAME}/config.json"
    content: "{ \"name\": \"{PROJECT_NAME}\" }"
```

#### In Shell Commands

```yaml
- name: "Initialize the project"
  action:
    type: "command"
    command: "npm init -y && npm pkg set name={PROJECT_NAME}"
```

#### In Messages

```yaml
- name: "Display a confirmation message"
  action:
    type: "message"
    content: "The project {PROJECT_NAME} has been successfully created on port {SERVER_PORT}."
    style: "success"
```

## Using Variables in Conditions

Variables can be used in conditions to execute steps conditionally. In this context, variables are used directly by
their name, without braces.

Examples of using variables in conditions:

```yaml
condition: 'PROJECT_TYPE == "react"'
condition: '"eslint" in SELECTED_TOOLS'
condition: 'SERVER_PORT > 3000'
condition: 'INSTALL_TYPESCRIPT == true'
```

For more information on conditions, see the [conditions documentation](conditions.md).

## Predefined Variables

Codx provides certain predefined variables that can be used in your recipes:

| Variable                      | Description                                                                                                                                               |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `$CWD`                        | The absolute path of the Codx execution directory                                                                                                         |
| `$ERROR`                      | Last error thrown by action                                                                                                                               |
| `$PACKAGE_COMMANDS`           | Commands related to the current package manager (Object containing the properties `install`, `installDev`, `remove`, `update`, `execute`, `globalOption`) |
| `$PACKAGE_MANAGER`            | The name of the package manager used                                                                                                                      |
| `$PROJECT_DIRECTORY`          | The absolute path of the current project directory                                                                                                        |
| `$RECIPE_DIRECTORY`           | The absolute path of the recipe directory                                                                                                                 |
| `$RELATIVE_PROJECT_DIRECTORY` | The path relative to the Codx execution path of the current project directory                                                                             |
| true                          | Equals `true`                                                                                                                                             |
| false                         | Equals `false`                                                                                                                                            |

## Best Practices

- Use descriptive variable names.
- Variables starting with `$` are non-modifiable internal variables. Additionally, you cannot create variables starting
  with `$`.
- Define all necessary variables at the beginning of the recipe when possible.
- Use interpolation to make your recipes more dynamic and reusable.
- Check that variables are defined before using them.
- Use conditions to handle cases where a variable might not be defined.

## Complete Examples

Here is a complete example of using variables and interpolation in a recipe:

```yaml
description: "Web project configuration"
author: "Author"

steps:
  - name: "Enter project name"
    action:
      type: "prompt"
      promptType: "text"
      message: "Project name:"
      defaultValue: "my-web-project"
    variable: "PROJECT_NAME"

  - name: "Set server port"
    action:
      type: "prompt"
      promptType: "number"
      message: "Server port:"
      defaultValue: 3000
    variable: "SERVER_PORT"

  - name: "Choose a framework"
    action:
      type: "prompt"
      promptType: "select"
      message: "Framework to use:"
      choices:
        angular: "Angular"
        react: "React"
        vue: "Vue.js"
      defaultValue: "angular"
    variable: "FRAMEWORK"

  - name: "Create project directory"
    action:
      type: "fileSystem"
      operation: "mkdir"
      path: "{PROJECT_NAME}"

  - name: "Create package.json file"
    action:
      type: "fileSystem"
      operation: "create"
      path: "{PROJECT_NAME}/package.json"
      content: |
        {
          "name": "{PROJECT_NAME}",
          "version": "1.0.0",
          "description": "{FRAMEWORK} Project",
          "scripts": {
            "start": "serve -p {SERVER_PORT}"
          }
        }

  - name: "Install React dependencies"
    condition: 'FRAMEWORK == "react"'
    action:
      type: "package"
      operation: "install"
      packages:
        - "react"
        - "react-dom"
      workingDirectory: "{PROJECT_NAME}"

  - name: "Display confirmation message"
    action:
      type: "message"
      content: |
        🎉 Project {PROJECT_NAME} created successfully!

        Framework: {FRAMEWORK}
        Server port: {SERVER_PORT}

        To start the project:
        cd {PROJECT_NAME}
        npm start
      style: "success"
```

[← Writing Recipes](writing-recipes.md) ─ [Actions →](actions.md)