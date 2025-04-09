# Actions in Codx

This document provides an overview of the different actions in Codx. For detailed documentation of each action, please
refer to the corresponding links.

## Types of Actions

Codx offers several types of actions to automate different tasks:

1. [ChangeDir](actions/changeDir.md) - Change the working directory
2. [Command](actions/command.md) - Execute shell commands
3. [Fail](actions/fail.md) - Intentionally raise an error
4. [FileSystem](actions/fileSystem.md) - Manipulate files and directories
5. [Message](actions/message.md) - Display messages to the user
6. [Package](actions/package.md) - Manage packages and dependencies
7. [Prompt](actions/prompt.md) - Request information from the user

Each action has a specific type and associated parameters. Below is a brief overview of each type of action.

## ChangeDir

The `changeDir` action allows you to change the current working directory during the execution of a recipe. This action
is useful when you need to execute commands in a specific directory.

You can specify absolute or relative paths, and use variables to dynamically construct the path.

For more details, see the [complete documentation of the ChangeDir action](actions/changeDir.md).

## Command

The `command` action allows you to execute shell commands in the terminal. This action is fundamental for automating
tasks such as installing dependencies, compiling code, or any other operation requiring the use of the terminal.

You can execute any valid shell command, including those using variables previously defined in your recipe.

For more details, see the [complete documentation of the Command action](actions/command.md).

## Fail

The `fail` action allows you to intentionally raise an error during the execution of a recipe. This action is useful for stopping the execution of a recipe when a specific condition is not met.

You can specify a custom error message that will be displayed when the error is raised.

For more details, see the [complete documentation of the Fail action](actions/fail.md).

## FileSystem

The `fileSystem` action allows you to manipulate files and directories. This action is essential for creating,
modifying, deleting, copying, or moving files and directories in your project.

Several operations are available:

- **create**: Create a file with specific content
- **delete**: Delete a file or directory
- **exists**: Check if a file or directory exists
- **mkdir**: Create a directory
- **copy**: Copy a file or directory
- **move**: Move a file or directory

These operations allow you to automate the management of files and directories in your recipes.

For more details, see the [complete documentation of the FileSystem action](actions/fileSystem.md).

## Message

The `message` action allows you to display messages to the user during the execution of a recipe. This action is useful
for providing information, instructions, or feedback on the progress of the recipe.

Different message styles are available: `header`, `info`, `success`, `warning`, `error`, and `default`.

For more details, see the [complete documentation of the Message action](actions/message.md).

## Package

The `package` action allows you to manage packages and dependencies in your project. This action is particularly useful
for automating the installation, removal, updating, and checking of your project's dependencies.

Several operations are available:

- **install**: Install packages
- **remove**: Remove packages
- **update**: Update packages
- **check**: Check the presence and version of packages
- **run**: Execute a package

These operations allow you to automate dependency management in your recipes, which is particularly useful for quickly
setting up a development environment.

For more details, see the [complete documentation of the Package action](actions/package.md).

## Prompt

The `prompt` action allows you to request information from the user during the execution of a recipe. This action is
essential for making your recipes interactive and customizable.

Several types of prompts are available:

- **text**: For entering text
- **number**: For entering numerical values
- **select**: For choosing one option among several
- **checkbox**: For selecting multiple options
- **confirm**: For answering yes or no

The values entered by the user can be stored in variables for later use in the recipe.

For more details, see the [complete documentation of the Prompt action](actions/prompt.md).

[← Variables and Interpolation](variables-and-interpolation.md) ─ [Conditions →](conditions.md)
