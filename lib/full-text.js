'use strict';

const url = require('url');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const got = require('got');
const entities = require('entities');

const cleanHtml = require('./clean-html');
const { headers, getCharset } = require('./utils');

module.exports = class FullText {
  constructor(args) {
    this.uri = args.uri;
    this.target = args.target;
    this.exclude = args.exclude;
    this.max = args.max;
    this.mercuryToken = args.mercuryToken;
    this.pureHtml = args.pureHtml;
  }

  static convertCharset(res) {
    const charset = getCharset(res.headers['content-type']);

    if (charset && !/utf-*8/i.test(charset)) {
      const str = iconv.decode(res.body, charset);
      res.body = iconv.encode(str, 'utf-8');
    }

    return res;
  }

  static async mercuryParser(uri, mercuryToken) {
    if (!mercuryToken) {
      throw new Error('Missing Mercury token');
    }

    const res = await got(`https://mercury.postlight.com/parser?url=${uri}`, {
      headers: {
        'x-api-key': mercuryToken,
      },
    });
    const body = JSON.parse(res.body);
    return entities.decodeXML(body.content);
  }

  parse(res, uri) {
    const $ = cheerio.load(res.body, {
      decodeEntities: false,
    });

    return $(this.target).map((_, element) => {
      const result = $(element).find(this.exclude).remove().end();

      result.find('a, img').each((_, target) => {
        target = $(target);
        const tagName = target.get(0).tagName;
        const hash = {
          a: 'href',
          img: 'src',
        };
        const attrName = hash[tagName];
        const attrValue = target.attr(attrName);

        if (attrValue && !url.parse(attrValue).host) {
          target.attr(attrName, url.resolve(uri, attrValue));
        }
      });

      return $.html(result);
    }).get().join('\n');
  }

  async get(uri) {
    if (!this.target) {
      return await FullText.mercuryParser(uri, this.mercuryToken);
    }

    let res = await got(uri, {
      headers,
      encoding: null,
    });
    res = FullText.convertCharset(res);

    let text = this.parse(res, uri);

    if (!text && this.mercuryToken) {
      return await FullText.mercuryParser(uri, this.mercuryToken);
    }

    text = text || `[[ There is no such elements: ${this.target} ]]`;

    if (this.pureHtml) {
      return cleanHtml(text);
    }

    return text;
  }
}
