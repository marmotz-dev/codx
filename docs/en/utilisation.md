# Installation and Usage of Codx

This guide explains how to install and use Codx to automate the installation and configuration of libraries and tools in
your projects.

## Installation

You can install Codx globally using your preferred package manager:

* with npm: `npm install -g codx`
* with yarn: `yarn global add codx`
* with pnpm: `pnpm add -g codx`
* with bun: `bun add -g codx`

You can also run Codx without installation:

* with npm: `npx codx`
* with yarn: `yarn dlx codx`
* with pnpm: `pnpm dlx codx`
* with bun: `bunx codx`

## Basic Usage

### Running a Recipe

To run a recipe, use the following command:

```bash
codx run <recipe-name>
```

If you have a local recipe file, you can run it with:

```bash
codx run path/to/recipe.yml
```

#### Options

* `--pm <package-manager>`: forces the package manager to use (possible values: npm, pnpm, yarn, bun). By default, the
  package manager used to run Codx will be used.
* `-p, --project-dir <project-dir>`: defines the project directory. By default, it's the current directory.
* `-v, --verbose`: displays debug messages.

#### Usage Examples

Here are some examples of using Codx:

1. **Install React with Tailwind CSS and ESLint/Prettier**:
   ```bash
   codx recipe react
   ```

2. **Run a custom recipe**:
   ```bash
   codx recipe ./my-recipes/project-setup.yml
   ```

### Searching for Recipes

To search for npm packages related to Codx, use the following command:

```bash
codx search <search-term>
```

This command searches for Codx recipes. The results display the package name, its description, version, author, and a
link to the package page.

#### Options

* `-v, --verbose`: displays debug messages.

[← Home](index.md) ─ [Writing Recipes →](writing-recipes.md)