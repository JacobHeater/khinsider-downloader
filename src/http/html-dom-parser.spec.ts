import { ArgumentInvalidError } from '../argument-invalid-error';
import { HtmlDomParser } from './html-dom-parser';

it('Should parse a valid html string as a DOM object', async () => {
  const url = `https://www.google.com`;

  try {
    const response = await new HtmlDomParser().urlRequestToDomAsync(url);

    expect(response).toBeDefined();
    expect(response).not.toBeNull();
    expect(response?.window).toBeDefined();
  } catch (err) {
    fail(err);
  }
});

it(`Should throw an ${ArgumentInvalidError.name} when the url argument is invalid.`, async () => {
  expect(async () => await new HtmlDomParser().urlRequestToDomAsync('')).rejects.toThrow(
    ArgumentInvalidError
  );
  expect(async () => await new HtmlDomParser().urlRequestToDomAsync('   ')).rejects.toThrow(
    ArgumentInvalidError
  );
  expect(async () => await new HtmlDomParser().urlRequestToDomAsync(null as any)).rejects.toThrow(
    ArgumentInvalidError
  );
  expect(
    async () => await new HtmlDomParser().urlRequestToDomAsync(undefined as any)
  ).rejects.toThrow(ArgumentInvalidError);
});

it(`Should throw an ${ArgumentInvalidError.name} when the method argument is invalid.`, async () => {
  expect(
    async () => await new HtmlDomParser().urlRequestToDomAsync('https://www.google.com', '' as any)
  ).rejects.toThrow(ArgumentInvalidError);
  expect(
    async () =>
      await new HtmlDomParser().urlRequestToDomAsync('https://www.google.com', '    ' as any)
  ).rejects.toThrow(ArgumentInvalidError);
  expect(
    async () =>
      await new HtmlDomParser().urlRequestToDomAsync('https://www.google.com', null as any)
  ).rejects.toThrow(ArgumentInvalidError);
});
