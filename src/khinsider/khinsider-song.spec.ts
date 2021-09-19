import { ArgumentInvalidError } from '../argument-invalid-error';
import { KhInsiderSong } from './khinsider-song';

it(`Should throw an ${ArgumentInvalidError.name} when the constructor is called with invalid arguments.`, () => {
  expect(() => new KhInsiderSong(null as any, 'test', 1)).toThrow(ArgumentInvalidError);
  expect(() => new KhInsiderSong('test', null as any, 1)).toThrow(ArgumentInvalidError);
  expect(() => new KhInsiderSong('test', 'test', 'string' as unknown as number)).toThrow(
    ArgumentInvalidError
  );
  expect(() => new KhInsiderSong('test', 'test', 0)).toThrow(
    ArgumentInvalidError
  );
});
