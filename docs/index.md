# Codx

Codx is a command-line tool that automates the installation and configuration of third-party libraries and tools in your
projects. Instead of following lengthy documentation steps manually, you can use Codx recipes to automate the process.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Steps Reference](steps.md)
5. [Writing Recipes](writing-recipes.md)

## Getting Started

Codx allows you to:

- Install dependencies with specific versions
- Create configuration files
- And more...

## Installation

You can install Codx globally using your preferred package manager:

* using npm : `npm install -g codx`
* using yarn : `yarn global add codx`
* using pnpm : `pnpm add -g codx`
* using bun : `bun add -g codx`

You can also launch Codx without installation :

* using npm : `npx codx`
* using yarn : `yarn dlx codx`
* using pnpm : `pnpm dlx codx`
* using bun : `bunx codx`

## Usage

To execute a recipe: `codx recipe <recipe-name>`
Or if you have a local recipe file: `codx recipe path/to/recipe.yml`