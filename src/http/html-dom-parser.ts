import axios, { Method } from 'axios';
import puppeteer, { Browser } from 'puppeteer';
import { JSDOM, VirtualConsole } from 'jsdom';
import { ArgumentInvalidError, ArgumentInvalidReason } from '../argument-invalid-error';
import { logger } from '../logging/logger';

import { isStringFalsey } from '../validation/string-validation';
import { isSuccessCode } from './status-codes';

const DEFAULT_REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  Referer: 'https://downloads.khinsider.com/',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-User': '?1',
  'Sec-Fetch-Dest': 'document',
  'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not:A-Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  Connection: 'keep-alive',
  'Cache-Control': 'max-age=0'
};

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
  async urlRequestToDomAsync(url: string, method: Method = 'GET'): Promise<JSDOM | undefined> {
    if (isStringFalsey(url)) {
      throw new ArgumentInvalidError('url', ArgumentInvalidReason.Null);
    }

    if (isStringFalsey(method)) {
      throw new ArgumentInvalidError('method', ArgumentInvalidReason.Null);
    }

    try {
      const response = await axios.request({
        method,
        url,
        headers: DEFAULT_REQUEST_HEADERS,
        responseType: 'text',
        maxRedirects: 5,
      });

      if (!isSuccessCode(response.status)) {
        throw new Error(response.statusText || `HTTP ${response.status}`);
      }

      if (!(response.headers['content-type'] as string).includes('text/html')) {
        throw new Error('Response was not HTML and cannot be parsed to JSDOM.');
      }

      const virtualConsole = new VirtualConsole();
      virtualConsole.on('error', () => {
        // Ignore parsing errors emitted by jsdom for malformed stylesheet content.
      });

      return new JSDOM(response.data, { virtualConsole });
    } catch (e) {
      const errorMessage = (e as Error).message || '';
      logger.error(
        `Could not get DOM for requested URL "${url}" due to underlying HTTP error. ${errorMessage}`
      );

      if (errorMessage.includes('403') || (e as any)?.response?.status === 403) {
        const fallbackHtml = await this.tryCloudflareFallbackAsync(url);
        if (fallbackHtml) {
          const virtualConsole = new VirtualConsole();
          virtualConsole.on('error', () => {
            // Ignore parsing errors emitted by jsdom for malformed stylesheet content.
          });

          return new JSDOM(fallbackHtml, { virtualConsole });
        }

        return await this.tryPuppeteerFallbackAsync(url);
      }
    }
  }

  private async tryCloudflareFallbackAsync(url: string): Promise<string | undefined> {
    try {
      const cloudscraper = require('cloudscraper') as any;
      return await cloudscraper.get({
        uri: url,
        headers: DEFAULT_REQUEST_HEADERS,
        jar: true,
        followAllRedirects: true,
        gzip: true,
      });
    } catch (cloudErr) {
      logger.error(
        `Cloudflare fallback request for "${url}" failed. ${(cloudErr as Error).message}`
      );
      return undefined;
    }
  }

  private async tryPuppeteerFallbackAsync(url: string): Promise<JSDOM | undefined> {
    let browser: Browser | undefined;

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      await page.setUserAgent(DEFAULT_REQUEST_HEADERS['User-Agent']);
      await page.setExtraHTTPHeaders({
        Accept: DEFAULT_REQUEST_HEADERS.Accept,
        'Accept-Language': DEFAULT_REQUEST_HEADERS['Accept-Language'],
        Referer: DEFAULT_REQUEST_HEADERS.Referer,
      });

      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      const html = await page.content();
      const virtualConsole = new VirtualConsole();
      virtualConsole.on('error', () => {
        // Ignore parsing errors emitted by jsdom for malformed stylesheet content.
      });

      return new JSDOM(html, { virtualConsole });
    } catch (browserError) {
      logger.error(
        `Puppeteer fallback request for "${url}" failed. ${(browserError as Error).message}`
      );
      return undefined;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}
