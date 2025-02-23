# Reference of Actions Related to the File System

This document details all available actions related to the file system that can be used in Codx recipes.

## Copying Files and Directories (copy)

Copies files or directories from the recipe directory to your project directory.

If necessary, it creates directories.

### Parameters

Array of objects with, for each object:

* from: Source path (relative to the recipe directory)
* to: Destination path (relative to the project directory)

Example:

```yaml
recipe:
  - fs.copy:
      - from: root
        to: .
      - from: test.json
        to: config/.test.json
      - from: back-config
        to: back/config
```

copies:

* the content of the directory `/recipe/root` to `/project/`;
* the file `/recipe/test.json` to `/project/config/.test.json`, renaming the file `test.json` to `.test.json` and, if
  necessary, creating the directory `/project/config/`;
* the directory `/recipe/back-config` and its content to `/project/back/config`, renaming the directory `back-config` to
  `config` and, if necessary, creating the directory `/project/back/`.

## Deleting Files and Directories (delete)

Deletes files or directories in your project directory.

If it’s a directory, it recursively deletes all files and subdirectories within it.

### Parameters

A path to delete or a list of paths to delete.

Example:

```yaml
recipe:
  - fs.delete: test.json
  - fs.delete:
      - front/config.json
      - back/config
```

deletes:

* the file `/project/test.json`;
* the file `/project/front/config.json`;
* the directory `/project/back/config` and its content (files and directories).

## Creating Directories (mkdir)

Creates one or more directories in your project directory.

### Parameters

A path to create or a list of paths to create.

Example:

```yaml
recipe:
  - fs.mkdir: test
  - fs.mkdir:
      - front/config
      - back/config
```

creates:

* the directory `/project/test/`;
* the directory `/project/front/config`;
* the directory `/project/back/config`.
