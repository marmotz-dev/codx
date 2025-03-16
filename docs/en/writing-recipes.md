# Writing Codx Recipes

This guide explains how to write your own Codx recipes to automate the installation and configuration of libraries and
tools in your projects.

## Recipe Structure

A Codx recipe is a YAML file that contains the following elements:

- **description**: A description of what the recipe does
- **author**: The author of the recipe
- **steps**: A list of steps to execute

Here's an example of a basic structure:

```yaml
description: "Setting up a React project with Tailwind CSS"
author: "Your Name"

steps:
  - action:
      type: "message"
      content: "Welcome to the React with Tailwind CSS installation assistant!"
      style: "header"

  # Other steps...
```

## Recipe Steps

Each step in a recipe can contain the following elements:

- **name** (optional): A name for the step
- **condition** (optional): A condition to execute the step
- **action** (required): The action to execute
- **onSuccess** (optional): A list of actions to execute in case of success
- **onFailure** (optional): A list of actions to execute in case of failure
- **finally** (optional): A list of actions to execute in all cases
- **workingDirectory** (optional): The execution path of the step
- **variable** (optional): The name of the variable where to store the result of the action

Example of a step:

```yaml
- name: "Installing ESLint"
  condition: '"eslint" in PACKAGES_TO_INSTALL'
  action:
    type: "package"
    operation: "install"
    packages:
      - "eslint"
      - "eslint-plugin-react"
    dev: true
  onSuccess:
    - action:
        type: "message"
        content: "ESLint installed successfully!"
        style: "success"
  onFailure:
    - action:
        type: "message"
        content: "Failed to install ESLint."
        style: "error"
  workingDirectory: front
```

## Variables and Interpolation

You can use variables in your recipes to store and reuse values. Variables are defined with the `variable` attribute in
a step.

To use a variable in a string, use the syntax `{VARIABLE_NAME}`:

```yaml
- name: "Enter project name"
  action:
    type: "prompt"
    promptType: "text"
    message: "Project name:"
    defaultValue: "my-project"
  variable: "PROJECT_NAME"

- name: "Create project directory"
  action:
    type: "fileSystem"
    operation: "mkdir"
    path: "{PROJECT_NAME}"
```

For more information on this topic, see
the [documentation on variables and interpolation](variables-and-interpolation.md).

## Conditions

You can use conditions to execute steps conditionally. Conditions are JavaScript expressions evaluated as true or false.

Examples of conditions:

```yaml
condition: 'PROJECT_TYPE == "react"'
condition: '"eslint" in SELECTED_TOOLS'
condition: 'INSTALL_TAILWIND == true'
```

For more information on this topic, see the [conditions documentation](conditions.md).

## Actions

Actions allow you to act on your project, ask for information, execute commands, etc.

For more information on this topic, see the [actions documentation](actions.md).

## Publication

If you want to share your recipe, you must publish a package on npmjs with a name ending in "-codx-recipe". Also make
sure to add the keyword `codx-recipe` in the keywords of your package's `package.json` file.

This will allow the recipe to be recognized and usable by Codx, while being easily findable using the `codx search`
command.

[← Installation and Usage](utilisation.md) ─ [Variables and Interpolation →](variables-and-interpolation.md)