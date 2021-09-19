import { ArgumentInvalidError } from '../argument-invalid-error';
import { KhInsiderDownloadData } from './khinsider-download-data';
import { KhInsiderSong } from './khinsider-song';

it(`Should throw an ${ArgumentInvalidError.name} when the constructor is called with invalid arguments.`, () => {
  expect(() => new KhInsiderDownloadData(null as any, Buffer.from('This is a test'))).toThrow(
    ArgumentInvalidError
  );
  expect(
    () => new KhInsiderDownloadData(new KhInsiderSong('test', 'test', 0), null as any)
  ).toThrow(ArgumentInvalidError);
  expect(() => new KhInsiderDownloadData(null as any, null as any)).toThrow(ArgumentInvalidError);
});
