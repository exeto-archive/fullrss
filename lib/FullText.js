'use strict';

const url = require('url');
const co = require('co');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const got = require('got');
const entities = require('entities');

const cleanHtml = require('./cleanHtml');
const getParams = require('./getParams');

module.exports = class FullText {
  constructor(args) {
    this.args = args;
  }

  static getPage(targetUrl) {
    return got(targetUrl, {
      encoding: null,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/45.0.2454.99 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,' +
          'image/webp,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, sdch',
        'accept-language': 'ru,en-US;q=0.8,en;q=0.6,it;q=0.4,fr;q=0.2,de;q=0.2',
      },
    });
  }

  static convertCharset(res) {
    const charset = getParams(res.headers['content-type']).charset;

    if (charset && !/utf-*8/i.test(charset)) {
      const str = iconv.decode(res.body, charset);
      res.body = iconv.encode(str, 'utf-8');
    }

    return res;
  }

  static mercuryParser(targetURL, mercuryToken) {
    return co(function* () {
      if (!mercuryToken) {
        return yield Promise.reject(new Error('Missing Mercury token'));
      }

      const res = yield got(`https://mercury.postlight.com/parser?url=${targetURL}`, {
        headers: {
          'x-api-key': mercuryToken,
        },
      });
      const body = JSON.parse(res.body);
      return entities.decodeXML(body.content);
    });
  }

  parse(res, targetUrl) {
    const args = this.args;
    const $ = cheerio.load(res.body, {
      decodeEntities: false,
    });

    return $(args.elements).map(function () {
      const $this = $(this).find(args.dropElements).remove().end();

      $this.find('a, img').each(function () {
        const target = $(this);
        const tagName = target.get(0).tagName;
        let attr;

        if (tagName === 'a') {
          attr = 'href';
        } else if (tagName === 'img') {
          attr = 'src';
        }

        const attrValue = target.attr(attr);

        if (attrValue && !url.parse(attrValue).host) {
          target.attr(attr, url.resolve(targetUrl, attrValue));
        }
      });

      return $.html($this);
    }).get().join('\n');
  }

  get(targetUrl) {
    const self = this;

    return co(function* () {
      let res;
      let text;

      if (!self.args.elements) {
        return yield FullText.mercuryParser(targetUrl, self.args.mercuryToken);
      }

      res = yield FullText.getPage(targetUrl);
      res = FullText.convertCharset(res);
      text = self.parse(res, targetUrl);

      if (!text && self.args.mercuryToken) {
        return yield FullText.mercuryParser(targetUrl, self.args.mercuryToken);
      }

      text = text || `[[ There is no such elements: ${self.args.elements} ]]`;

      if (self.args.pureHtml) {
        return yield cleanHtml(text);
      }

      return text;
    });
  }
};
