import { join } from 'path';
import process from 'process';

import { ArgumentInvalidError } from '../argument-invalid-error';
import { FileInterface } from './file-interface';

class TestFileInterface extends FileInterface {
  testCleanFileName(filename: string): string {
    return this.cleanFileName(filename);
  }

  testGetFilePath(filename: string): string {
    return this.getFilePath(filename);
  }
}

it('Should resolve the homedir when the path starts with the ~ character.', () => {
  const path = '~/Downloads';
  const io = new FileInterface(path);

  expect(io.resolveHomeDir(path)).not.toContain('~/');
  expect(io.resolveHomeDir(path).startsWith('~/')).toBe(false);
});

it(`Should throw an ${ArgumentInvalidError.name} when the input is invalid on ${FileInterface.prototype.resolveHomeDir.name}`, () => {
  const io = new FileInterface(process.cwd());
  expect(() => io.resolveHomeDir('')).toThrow(ArgumentInvalidError);
  expect(() => io.resolveHomeDir('    ')).toThrow(ArgumentInvalidError);
  expect(() => io.resolveHomeDir(undefined as any)).toThrow(ArgumentInvalidError);
  expect(() => io.resolveHomeDir(null as any)).toThrow(ArgumentInvalidError);
});

it('Should return the fully resolved file path when the basePath property is retrieved.', () => {
  const path = '~/Downloads';
  const io = new FileInterface(path);

  expect(io.basePath).not.toContain('~/');
  expect(io.basePath.startsWith('~/')).toBe(false);
});

it('Should throw an error on instantiation when the path is null | undefined.', () => {
  [null, undefined, '', '   '].forEach((item: any) =>
    expect(() => new FileInterface(item)).toThrow(ArgumentInvalidError)
  );
});

it('Should determine if a file exists at the given path.', async () => {
  const io = new FileInterface(process.cwd());
  expect(await io.fileExistsAsync('tsconfig.json')).toBe(true);
});

it('Should write and delete a file at the given path.', async () => {
  const io = new FileInterface(process.cwd());
  await io.writeFileAsync('tmp.txt', 'This is a temp file.');
  expect(await io.fileExistsAsync('tmp.txt')).toBe(true);
  await io.deleteFileAsync('tmp.txt');
  expect(await io.fileExistsAsync('tmp.txt')).toBe(false);
});

it(`Shold throw an ${ArgumentInvalidError.name} when the input to ${FileInterface.prototype.fileExistsAsync.name} is invalid.`, async () => {
  const io = new FileInterface(process.cwd());
  expect(async () => await io.fileExistsAsync('')).rejects.toThrow(ArgumentInvalidError);
  expect(async () => await io.fileExistsAsync('   ')).rejects.toThrow(ArgumentInvalidError);
  expect(async () => await io.fileExistsAsync(null as any)).rejects.toThrow(ArgumentInvalidError);
  expect(async () => await io.fileExistsAsync(undefined as any)).rejects.toThrow(
    ArgumentInvalidError
  );
});

it(`Should throw an ${ArgumentInvalidError.name} when the fileName parameter is empty on ${FileInterface.prototype.writeFileAsync.name}`, async () => {
  const io = new FileInterface(process.cwd());
  expect(async () => await io.writeFileAsync('', 'Test')).rejects.toThrow(ArgumentInvalidError);
  expect(async () => await io.writeFileAsync('     ', 'Test')).rejects.toThrow(
    ArgumentInvalidError
  );
  expect(async () => await io.writeFileAsync(null as any, 'Test')).rejects.toThrow(
    ArgumentInvalidError
  );
  expect(async () => await io.writeFileAsync(undefined as any, 'Test')).rejects.toThrow(
    ArgumentInvalidError
  );
});

it(`Should throw an ${ArgumentInvalidError.name} when the fileName parameter is empty on ${FileInterface.prototype.deleteFileAsync.name}`, async () => {
  const io = new FileInterface(process.cwd());
  expect(async () => await io.deleteFileAsync('')).rejects.toThrow(ArgumentInvalidError);
  expect(async () => await io.deleteFileAsync('     ')).rejects.toThrow(ArgumentInvalidError);
  expect(async () => await io.deleteFileAsync(null as any)).rejects.toThrow(ArgumentInvalidError);
  expect(async () => await io.deleteFileAsync(undefined as any)).rejects.toThrow(
    ArgumentInvalidError
  );
});

it(`Should throw an ${ArgumentInvalidError.name} when the data parameter is invalid on ${FileInterface.prototype.writeFileAsync.name}`, async () => {
  const io = new FileInterface(process.cwd());
  expect(async () => await io.writeFileAsync('test.json', null as any)).rejects.toThrow(
    ArgumentInvalidError
  );
  expect(async () => await io.writeFileAsync('test.json', undefined as any)).rejects.toThrow(
    ArgumentInvalidError
  );
  expect(async () => await io.writeFileAsync('test.json', '')).rejects.toThrow(
    ArgumentInvalidError
  );
});

it('Should clean a file name when it has illegal characters.', () => {
  const io = new TestFileInterface(process.cwd());
  let illegalFileName = 'my\\-illegal*-?file%<>-name|*".txt';
  illegalFileName = io.testCleanFileName(illegalFileName);

  expect(illegalFileName).toBe('my-illegal-file-name.txt');
});

it(`Should throw an ${ArgumentInvalidError.name} on clean file name when the input is invalid.`, () => {
  const io = new TestFileInterface(process.cwd());
  expect(() => io.testCleanFileName(null as any)).toThrow(ArgumentInvalidError);
  expect(() => io.testCleanFileName(undefined as any)).toThrow(ArgumentInvalidError);
  expect(() => io.testCleanFileName('')).toThrow(ArgumentInvalidError);
});

it('Should get a file path that joins on the base path for the given file name.', () => {
  const io = new TestFileInterface(process.cwd());
  const actual = io.testGetFilePath('tsconfig.json');
  const expected = join(io.basePath, 'tsconfig.json');

  expect(actual).toBe(expected);
});

it(`Should throw an ${ArgumentInvalidError.name} on get file path when the input is invalid.`, () => {
  const io = new TestFileInterface(process.cwd());
  expect(() => io.testGetFilePath(null as any)).toThrow(ArgumentInvalidError);
  expect(() => io.testGetFilePath(undefined as any)).toThrow(ArgumentInvalidError);
  expect(() => io.testGetFilePath('')).toThrow(ArgumentInvalidError);
});
