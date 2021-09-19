import glob from 'fast-glob';
import { join } from 'path';
import rimraf from 'rimraf';
import { v4 as uuid } from 'uuid';

import { ArgumentInvalidError } from '../argument-invalid-error';
import { AlbumNotFoundError } from './album-not-found-error';
import { BASE_URL, getKhInsiderAlbumUrl, KhInsiderNavigator } from './khinsider-navigator';

const BASE_DIR = join(process.cwd(), 'temp');

jest.setTimeout(60000);

afterAll(() => rimraf.sync(BASE_DIR));

it(`Should throw an ${ArgumentInvalidError.name} when the constructor is called with invalid arguments.`, () => {
    expect(() => new KhInsiderNavigator('', BASE_DIR, 'mp3')).toThrow(ArgumentInvalidError);
    expect(() => new KhInsiderNavigator('   ', BASE_DIR, 'mp3')).toThrow(ArgumentInvalidError);
    expect(() => new KhInsiderNavigator(null as any, BASE_DIR, 'mp3')).toThrow(ArgumentInvalidError);
    expect(() => new KhInsiderNavigator(undefined as any, BASE_DIR, 'mp3')).toThrow(ArgumentInvalidError);

    expect(() => new KhInsiderNavigator('temp', '', 'mp3')).toThrow(ArgumentInvalidError);
    expect(() => new KhInsiderNavigator('temp', '  ', 'mp3')).toThrow(ArgumentInvalidError);
    expect(() => new KhInsiderNavigator('temp', null as any, 'mp3')).toThrow(ArgumentInvalidError);
    expect(() => new KhInsiderNavigator('temp', undefined as any, 'mp3')).toThrow(ArgumentInvalidError);

    expect(() => new KhInsiderNavigator('temp', BASE_DIR, '   ' as any)).toThrow(ArgumentInvalidError);
    expect(() => new KhInsiderNavigator('temp', BASE_DIR, '' as any)).toThrow(ArgumentInvalidError);
    expect(() => new KhInsiderNavigator('temp', BASE_DIR, 'invalid' as any)).toThrow(ArgumentInvalidError);
    expect(() => new KhInsiderNavigator('temp', BASE_DIR, null as any)).toThrow(ArgumentInvalidError);
    // `undefined` doesn't work because of default value.
});

it(`Should get a valid khinsider URL when calling ${getKhInsiderAlbumUrl.name}.`, () => {
  const actual = getKhInsiderAlbumUrl('my-album');
  const expected = `${BASE_URL}/my-album`;

  expect(actual).toBe(expected);
});

it(`Download an album to the given folder from khinsider in mp3 format.`, async () => {
  const albumName = 'streets-of-rage';
  const outdir = join(BASE_DIR, 'mp3');
  const navigator = new KhInsiderNavigator(albumName, outdir, 'mp3');
  await navigator.downloadAlbumAsync();
  const mp3s = await glob(join(outdir, '**', '*.mp3'));
  const flacs = await glob(join(outdir, '**', '*.flac'));

  expect(mp3s.length).toBe(21);
  expect(flacs.length).toBe(0);
});

it(`Download an album to the given folder from khinsider in flac format.`, async () => {
  const albumName = 'streets-of-rage-2-bare-knuckle-ii-genesis';
  const outdir = join(BASE_DIR, 'flac');
  const navigator = new KhInsiderNavigator(albumName, outdir, 'flac');
  await navigator.downloadAlbumAsync();
  const mp3s = await glob(join(outdir, '**', '*.mp3'));
  const flacs = await glob(join(outdir, '**', '*.flac'));

  expect(mp3s.length).toBe(0);
  expect(flacs.length).toBe(24);
});

it(`Should throw an ${AlbumNotFoundError.name} when the album name is not an existing album.`, async () => {
  const albumName = uuid();
  const outdir = join(BASE_DIR, 'unknown');
  const navigator = new KhInsiderNavigator(albumName, outdir, 'mp3');
  expect(async () => await navigator.downloadAlbumAsync()).rejects.toThrow(AlbumNotFoundError);
});
