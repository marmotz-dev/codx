# Codx

Codx is a command-line tool that automates the installation and configuration of third-party libraries and tools in your
projects. Instead of manually following complex documentation steps, you can use Codx recipes to automate the process.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Action Reference](actions.md)
5. [Writing Recipes](writing-recipes.md)

## Getting Started

Codx allows you to:

- Install dependencies with specific versions
- Create configuration files
- And much more...

## Installation

You can install Codx globally using the package manager of your choice:

* with npm: `npm install -g codx`
* with yarn: `yarn global add codx`
* with pnpm: `pnpm add -g codx`
* with bun: `bun add -g codx`

You can also run Codx without installation:

* with npm: `npx codx`
* with yarn: `yarn dlx codx`
* with pnpm: `pnpm dlx codx`
* with bun: `bunx codx`

## Usage

To execute a recipe: `codx recipe <recipe-name>`
Or if you have a local recipe file: `codx recipe path/to/recipe.yml`