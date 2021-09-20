import axios, { Method } from 'axios';
import { JSDOM } from 'jsdom';
import { ArgumentInvalidError, ArgumentInvalidReason } from '../argument-invalid-error';

import { isStringFalsey } from '../validation/string-validation';
import { isSuccessCode } from './status-codes';

export class HtmlDomParser {
  /**
   * Makes a request to the given URL and converts the response to
   * a JSDOM instance.
   *
   * Caveats:
   *
   * - The URL must return HTML.
   *
   * @param url The url to request.
   * @param method The http method to use.
   */
  async urlRequestToDomAsync(url: string, method: Method = 'GET'): Promise<JSDOM> {
    if (isStringFalsey(url)) {
      throw new ArgumentInvalidError('url', ArgumentInvalidReason.Null);
    }

    if (isStringFalsey(method)) {
      throw new ArgumentInvalidError('method', ArgumentInvalidReason.Null);
    }

    const response = await axios.request({
      method,
      url,
    });

    if (!isSuccessCode(response.status)) {
      throw new Error(response.statusText);
    }

    if (!(response.headers['content-type'] as string).includes('text/html')) {
      throw new Error('Response was not HTML and cannot be parsed to JSDOM.');
    }

    return new JSDOM(response.data);
  }
}
