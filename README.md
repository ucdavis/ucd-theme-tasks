# ucd-theme-tasks
CLI tool for base automation when compiling a UCD frontend.

This package contains all the CLI tasks needed by UCD frontend projects and
themes. It is heavily dependent on [Snowpack](https://www.snowpack.dev/).

## Installation
1. Require the ucd-theme-tasks package with node.js.
```
$ npm install ucd-theme-tasks --save-dev
```

2. Setup configuration files using the `init` command.
```
$ npx ucd-theme-tasks init
```

## CLI Commands

It is recommended to use the locally installed CLI via `npx`.

View a list of all CLI commands and options with:

```
npx ucd-theme-tasks help
```

### API & Usage
#### General usage
```
Usage: ucd-theme-tasks <command> [options]

Options:
  -V, --version         output the version number
  -h, --help            display help for command

Commands:
  init [options]        Copy starter files to a theme or custom site.
  build [options]       Build all assets using Snowpack.
  dev [options]         Development mode to build and watch all assets using Snowpack.
  lint [options]        Validate CSS and JS by linting
  patternlab [options]  Compile Pattern Lab
  sync [options]        Sync asset files like js, css, fonts, and images to a site.
  newsite [options]     Wire up a new site to allow syncing files from an existing project using its starterkit. This assumes the command
                        is being run within a project that has a "starterkit" directory
  help [command]        display help for command

Run "ucd-theme-tasks <command> --help" for detailed usage of given command.
```

#### Initialize a project and copy starter files.
```
Usage: init [options]

Copy starter files to a theme or custom site.

Options:
  -d, --dest <path>  Path to the theme directory or new site to export files into.
  -p, --patternlab   Use this inside Pattern Lab.
  -t, --themesync    Allow syncing with Pattern Lab.
  -f, --force        Force overwrite of existing files in theme.
  -h, --help         display help for command
```

#### Build production assets and files with Snowpack.
```
Usage: build [options]

Build all assets using Snowpack.

Options:
  --prefixFiles <glob>  CSS glob pattern [file|dir|glob]* to autoprefix css files.
  -p, --patternlab      Run the pattern lab build step before this build.
  -h, --help            display help for command
```

#### Development mode to serve and watch files with Snowpack.
```
Usage: dev [options]

Development mode to build and watch all assets using Snowpack.

Options:
  -p, --patternlab  Run the pattern lab build step before this build.
  -h, --help        display help for command
```

#### Validate CSS and JS by linting.
```
Usage: lint [options]

Validate CSS and JS by linting

Options:
  -f, --fix          Fix lint errors.
  -c, --css          Only lint SASS files.
  --cssFiles <glob>  SASS glob pattern [file|dir|glob]* to search for files.
  -j, --js           Only lint Javascript files.
  --jsFiles <glob>   Javascript glob pattern [file|dir|glob]* to search for files.
  -h, --help         display help for command
```

#### Pattern Lab integration.
```
Usage: patternlab [options]

Compile Pattern Lab

Options:
  -w, --watch  Watch for changes and rebuild.
  -h, --help   display help for command
```

#### Sync assets/files between sites.
```
Usage: sync [options]

Sync asset files like js, css, fonts, and images to a site.

Options:
  -d, --dest <path>  Path to the theme directory or new site to export files into.
  -s, --src <path>   Path to the source from which files will be imported.
  -h, --help         display help for command
```

#### Create a new site from an existing site's "starterkit".
**Notice:** This is only useful in an existing project that has already set up a
`starterkit` directory.
```
Usage: newsite [options]

Wire up a new site to allow syncing files from an existing project using its
starterkit. This assumes the command is being run within a project that has a
"starterkit" directory

Options:
  -d, --dest <path>  Path to the theme directory or new site to export files into.
  -f, --force        Force overwrite of existing files in theme.
  -h, --help         display help for command
```

## Validation and Linting
Lint all scss/js files using `npx ucd-theme-tasks lint`. Optionally pass the
`--fix` flag to attempt to automatically fix as many errors a possible.

### JavaScript Linting
Linting of JavaScript is done via [EsLint](https://eslint.org/).

A `.eslintrc.yml` configuration file will be copied to the root of your project
automatically when running the `ucd-theme-tasks init` command.

### Sass/Scss Linting
Linting of Sass/Scss files is done via [StyleLint](https://stylelint.io/).

A `.stylelintrc.yml` configuration file will be copied to the root of your
project automatically when running the `ucd-theme-tasks init` command.

## Configuration

### Snowpack
[Snowpack](https://www.snowpack.dev/) is used to compile all code and can be
configured with the `snowpack.config.js` file.
https://www.snowpack.dev/reference/configuration

### Default Tasks
`tasks-config.default.js` contains all of the default configuration for
controlling the tasks. This file can be referenced for all possible config
options. Docs can be found at [https://github.com/ucdavis/ucd-theme-tasks/blob/master/docs/config.md](https://github.com/ucdavis/ucd-theme-tasks/blob/master/docs/config.md)

> **Version 4** removed many of the old configuration options since Snowpack handles
them. Most of the configuration is now about path locations for syncing files
across projects.

## Pattern Lab
If you are using this package within [Pattern Lab](https://patternlab.io/) then
it can build and watch patterns using `ucd-theme-tasks patternLab`.
