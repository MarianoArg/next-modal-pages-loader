# next-modal-pages-loader
A CLI to dynamically import [Next.js](https://github.com/vercel/next.js) pages to be rendered inside a modal without losing navigation.

_Note:_ This is a fork of the [react-native-storybook](https://github.com/storybooks/react-native-storybook) CLI, made by [elderfo](https://github.com/elderfo).

[![Build Status](https://travis-ci.org/MarianoArg/next-modal-pages-loader.svg?branch=master)](https://travis-ci.org/MarianoArg/next-modal-pages-loader) [![Known Vulnerabilities](https://snyk.io/test/github/MarianoArg/next-modal-pages-loader/badge.svg)](https://snyk.io/test/github/MarianoArg/next-modal-pages-loader)
[![codecov](https://codecov.io/gh/MarianoArg/next-modal-pages-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/MarianoArg/next-modal-pages-loader)

## Example:

Comming soon

## How to use it

Install it and add the folder where your modal pages are located in, after run it, a new file with a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) with the following format will be generated:

```json 
const PageRoutes = new Map();

PageRoutes.set({RegExp}, {Component});

export default PageRoutes;
```

You can build a function which iterates over the map and evaluate each regex, to get the component

## Installation

```bash
yarn add next-modal-pages-loader -D
```

Or

```bash
npm install next-modal-pages-loader --save-dev
```

## Configuration
The pages to be rendered inside a modal, needs to follow the same structure than the [Next.js pages](https://nextjs.org/docs/basic-features/pages).

### Options

| Setting | CLI Option | Type | Description | Default | 
|---|---|---|---|---|
| **searchDir** | `--searchDir` | `string` or `string[]` | The directory or pages, relative to the project root, to search for files in. | Project root |
| **outputFile** | `--outputFile` | `string` | The output file that will be written. It is relative to the project directory. | `./modalPages/routes.js` | 
| **loaderDir** | `--loaderDir` | `string` | The path to the loader file which will be rendered until the dynamically page is fully loaded | No loader |
| **pattern** | `--pattern` | `string` | The pattern of files to look at. It can be a specific file, or any valid glob. Note: if using the CLI, globs with `**/*...` must be escaped with quotes | `./modalPages/pages/index.js` | 
|  | `--silent` | | Silences output. This option is not supported in the `package.json` file. | 

> Note: When using the CLI, any of option passed will override the values in the `package.json`

#### `package.json`

```json
{
  "name": "MyProject",
  "scripts": {
    "loadModalPages": "mploader"
  },
  "config": {
    "next-modal-pages-loader": {
      "searchDir": ["./modalPages/pages"],
      "loaderDir": "./modalPages/loaderComponent.jsx",
      "pattern": "**/*.js",
      "outputFile": "./modalPages/routes.js"
    }
  }
}
```

#### CLI

CLI can be accessed from a terminal 
```bash
./node_modules/.bin/mploader <options>
```
or in package.json 
```json
{
  "scripts": {
    "loadModalPages": "mploader <options>"
  }
}
```

_Note:_ When using a glob with `**/*` it is required to be wrapped in quotes
