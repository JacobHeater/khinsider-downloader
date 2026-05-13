# KhInsider Downloader

[![Main Build](https://github.com/jacobheater/khinsider-downloader/actions/workflows/ci-main.yml/badge.svg)](https://github.com/jacobheater/khinsider-downloader/actions/workflows/ci-main.yml/badge.svg)

This is a small, but **lightning fast**, utility command line application
that aids with downloading soundtracks from [khinsider](https://downloads.khinsider.com/).
The purpose of this application is to expedite the
download process by downloading the album in the desired
format.

## Legal Disclaimer

This software is provided for educational and personal archival purposes only.
The author makes no representations or warranties regarding the legality of
downloading any particular content using this tool. Users are solely responsible
for ensuring that their use of this application complies with all applicable
local, state, national, and international laws, including but not limited to
copyright law, the Digital Millennium Copyright Act (DMCA), and the Computer
Fraud and Abuse Act (CFAA).

This tool does not host, distribute, reproduce, or otherwise make available any
copyrighted works. It is a general-purpose download utility that automates
access to publicly accessible URLs. The author has no affiliation with
KHInsider or any rights holder whose content may appear on that platform.

Use of this software to download copyrighted material without authorization
from the applicable rights holder may constitute copyright infringement and
is done entirely at the user's own risk. The author expressly disclaims any
liability for damages, claims, or legal consequences arising from such use.

By using this software, you acknowledge that you have read this disclaimer,
understand it, and agree to be bound by its terms.

## Getting Started

Follow the instructions below to get the app running.

### Installing the App

- Download NodeJS
- Run `npm install` in the project directory.

### Running the App

There are two ways to run the app - with `ts-node` directly
invoking the `index.ts` file, or you can use the `npm start` command, and pass the expected arguments there.

#### Available Arguments

```
Options:
      --help       Show help                                           [boolean]
      --version    Show version number                                 [boolean]
  -a, --album      The album to download.                    [string] [required]
  -o, --outdir     The name of the folder to produce.        [string] [required]
  -f, --format     Which format do you want to download?
                              [string] [choices: "flac", "mp3"] [default: "mp3"]
  -l, --log-level  What level of logging verbosity do you want?
                   [string] [choices: "info", "warn", "error"] [default: "info"]
```

#### Using `npm start`

```
npm start -- --album="{album here}" --outdir="~/Downloads"
```

#### Using `ts-node`

```
npx ts-node ./src/app.ts --album="{album here}" --outdir="~/Downloads" --format="mp3|flac" --log-level="info|warn|error"
```

#### Album Argument Explained

The `--album` argument should be the name of the album
that is the last part of the `khinsider` URL. An example
follows below.

Given the following URL: `https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-ocarina-of-time-1998-n64` you will want
to take the `legend-of-zelda-the-ocarina-of-time-1998-n64` portion of the URL. This is what must be supplied to the `--album` argument.

## How the Output is Generated

Given the album name, the `--outdir` argument will
be where the download is output. For example, given `legend-of-zelda-the-ocarina-of-time-1998-n64` as the
album name, then a folder will be created in the
supplied directory with the given album name. All
songs that are downloaded will be written to that named
folder.

## Development

### Available Scripts

The project includes several utility scripts to help with development:

- `npm run clean` - Removes bin, coverage, dist, and temp directories
- `npm run build` - Compiles TypeScript files
- `npm run rebuild` - Runs clean and build in sequence
- `npm run sync-version` - Synchronizes version between package.json and app-config.json
- `npm test` - Runs Jest tests
- `npm run test:coverage` - Runs tests with coverage reporting

### Version Management

The project uses `sync-version` script to keep version information consistent between package.json and the application configuration file. This script runs automatically after version changes through the `postversion` hook.

## Running from Source

To run the application from source code, you'll need to clone this repository
and have Node.js installed on your system. After cloning, run `npm install` to install dependencies, then use one of the run commands described above.

## Distribution

This application is distributed as source code and can be run with Node.js.
The application requires Node.js to be installed on the target system.

### Entry Point

The main entry point is `src/app.ts`. When using `ts-node` directly, you should use:

```
npx ts-node ./src/app.ts --album="{album here}" --outdir="~/Downloads"
```

### Event System

The application implements an event system that emits events when songs are written to disk. This could be useful for developers looking to extend the application's functionality.

### Error Handling

The application includes robust error handling for common scenarios:

- `AlbumNotFoundError` - Thrown when the specified album cannot be found
- `ArgumentInvalidError` - Thrown when command arguments are missing or invalid

## Issues

If you encounter any issues during use, please
enter an issue in the issue tracker. Pull requests
are greatly appreciated.