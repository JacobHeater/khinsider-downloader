# KhInsider Downloder

![Main Build](https://github.com/jacobheater/khinsider-downloader/actions/workflows/ci-main.yml/badge.svg)

This is a small utility command line application
that aids with downloading sountracks from
[khinsider](https://downloads.khinsider.com/).
The purpose of this application is to expedite the
download process by downloading the album in the desired
format.

## Getting Started

Follow the instructions below to get the app running.

### Installing the App

- Download NodeJS
- Run `npm install` in the project directory.

### Running the App

There are two ways to run the app – with `ts-node` directly
invoking the `index.ts` file, or you can use the `npm start`
command, and pass the expected arguments there.

#### Available Arguments

```bash
Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -a, --album    The album to download.                      [string] [required]
  -o, --outdir   The name of the folder to produce.          [string] [required]
  -f, --format   Which format do you want to download?
                              [string] [choices: "flac", "mp3"] [default: "mp3"]
```

#### Using `npm start`

```bash
npm start -- --album="{album here}" --outdir="~/Downloads"
```

#### Using `ts-node`

```bash
npx ts-node ./src/index.ts --album="{album here}" --outdir="~/Downloads"
```

#### Album Argument Explained

The `--album` argument should be the name of the album
that is the last part of the `khinsider` URL. An example
follows below.

Given the following URL:
`https://downloads.khinsider.com/game-soundtracks/album/legend-of-zelda-the-ocarina-of-time-1998-n64` you will want
to take the `legend-of-zelda-the-ocarina-of-time-1998-n64`
portion of the URL. This is what must be supplied to the
`--album` argument.

## How the Output is Generated

Given the album name, the `--outdir` argument will
be where the download is output. For example, given
`legend-of-zelda-the-ocarina-of-time-1998-n64` as the
album name, then a folder will be created in the
supplied directory with the given album name. All
songs that are downloaded will be written to that named
folder.

## Issues

If you encounter any issues during use, please
enter an issue in the issue tracker. Pull requests
are greatly appreciated.
