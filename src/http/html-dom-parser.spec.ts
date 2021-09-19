import { HtmlDomParser } from './html-dom-parser';

it('Should parse a valid html string as a DOM object', async () => {
  const url = `https://www.google.com`;

  try {
    const response = await new HtmlDomParser().urlRequestToDomAsync(url);

    expect(response).toBeDefined();
    expect(response).not.toBeNull();
    expect(response.window).toBeDefined();
  } catch (err) {
    fail(err);
  }
});
